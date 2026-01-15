// =========================================================
// 预约管理 API
// =========================================================

import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { sendEmail } from "../lib/email";
import { verifyTurnstile } from "../lib/turnstile";
import { notify } from "../lib/notify";

const app = new Hono<{ Bindings: Env }>();

// 辅助函数：格式化时间为意大利格式
const formatItalianDate = (
  dateInput: string | number | Date | null | undefined
): string => {
  // 1. 基础防错
  if (!dateInput) return "Data non disponibile";

  let date: Date;

  // 2. 解析逻辑
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "number") {
    // 自动识别秒(s)和毫秒(ms)
    date = new Date(dateInput < 10000000000 ? dateInput * 1000 : dateInput);
  } else if (typeof dateInput === "string") {
    // 修复 SQL 格式并处理潜在的无效字符串
    date = new Date(dateInput.replace(" ", "T"));
  } else {
    return "Data non valida";
  }

  // 3. 检查有效性
  if (isNaN(date.getTime())) {
    console.error("Invalid date input:", dateInput);
    return "Data non valida";
  }

  // 4. 使用 Intl 对象控制时区和格式
  // 配置为 24 小时制，并锁定罗马时区
  const formatter = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // 5. 提取各个部分并手动拼接成 DD/MM/YYYY HH:mm
  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value;

  return `${getPart("day")}/${getPart("month")}/${getPart("year")} ${getPart("hour")}:${getPart("minute")}`;
};

app.get("/", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare("SELECT * FROM bookings ORDER BY created_at DESC")
      .all();

    return c.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return c.json({ success: false, error: "获取预约失败" }, 500);
  }
});

// 获取单个预约
app.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");

    const booking = await c.env.luna_web_store
      .prepare("SELECT * FROM bookings WHERE id = ?")
      .bind(id)
      .first();

    if (!booking) {
      return c.json({ success: false, error: "预约不存在" }, 404);
    }

    return c.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return c.json({ success: false, error: "获取预约失败" }, 500);
  }
});

// 创建预约（公开接口）
app.post("/", async (c) => {
  try {
    const {
      customerName,
      phoneNumber,
      email,
      deviceModel,
      problemDescription,
      bookingTime,
      token,
    } = await c.req.json();

    const isVerified = await verifyTurnstile(token, c.env.TURNSTILE_SECRET_KEY);

    if (!isVerified) {
      return c.json({ success: false, error: "Invalid captcha token" }, 403);
    }

    // 验证必填字段
    if (
      !customerName ||
      !phoneNumber ||
      !deviceModel ||
      !problemDescription ||
      !bookingTime ||
      !email
    ) {
      return c.json(
        {
          success: false,
          error: "缺少必填字段",
        },
        400
      );
    }

    // 转换时间戳
    const timestamp = new Date(bookingTime).getTime();

    const result = await c.env.luna_web_store
      .prepare(
        `INSERT INTO bookings 
       (customer_name, email, phone_number, device_model, problem_description, booking_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        customerName,
        email,
        phoneNumber,
        deviceModel,
        problemDescription,
        timestamp,
        "pending"
      )
      .run();

    if (email) {
      c.executionCtx.waitUntil(
        sendEmail({
          to: email,
          type: "BOOKING_RECEIPT",
          props: {
            customerName,
            deviceModel,
            issueDescription: problemDescription,
            bookingTime: formatItalianDate(bookingTime),
          },
          env: c.env,
        })
      );
    }

    c.executionCtx.waitUntil(
      notify({
        api_url: c.env.BARK_API,
        title: "🚀 新预约提醒",
        message: `来自 ${customerName} 的预约：\n手机型号: ${deviceModel}\n故障: ${problemDescription}\n时间: ${formatItalianDate(bookingTime)}`,
        group: "Appuntamenti",
      })
    );

    return c.json(
      {
        success: true,
        message: "预约创建成功",
        data: {
          id: result.meta.last_row_id,
        },
      },
      201
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return c.json({ success: false, error: "创建预约失败" }, 500);
  }
});

// 更新预约状态（需要认证）
app.put("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const { status, email, time, customerName } = await c.req.json();

  try {
    // 构建更新字段
    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      // 验证状态值
      const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return c.json(
          {
            success: false,
            error: "无效的状态值",
          },
          400
        );
      }

      updates.push("status = ?");
      params.push(status);
    }

    if (time) {
      updates.push("booking_time = ?");
      params.push(time);
    }

    params.push(id);

    // 执行更新
    const query = `UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`;

    const result = await c.env.luna_web_store
      .prepare(query)
      .bind(...params)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "预约不存在" }, 404);
    }

    if (status === "confirmed" && email) {
      c.executionCtx.waitUntil(
        sendEmail({
          to: email,
          type: "BOOKING_CONFIRMATION",
          props: {
            customerName: customerName,
            bookingTime: formatItalianDate(time),
          },
          env: c.env,
        })
      );
    }

    return c.json({
      success: true,
      message: "预约状态更新成功",
    });
  } catch (error) {
    console.error("Update booking error:", error);
    return c.json({ success: false, error: "更新预约失败" }, 500);
  }
});

// 删除预约（需要认证）
app.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const { email, bookingTime, customerName } = await c.req.json();

    const result = await c.env.luna_web_store
      .prepare("DELETE FROM bookings WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "预约不存在" }, 404);
    }

    if (email) {
      c.executionCtx.waitUntil(
        sendEmail({
          to: email,
          type: "BOOKING_CANCELLATION",
          props: {
            customerName: customerName,
            bookingTime: formatItalianDate(bookingTime),
          },
          env: c.env,
        })
      );
    }

    return c.json({
      success: true,
      message: "预约删除成功",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    return c.json({ success: false, error: "删除预约失败" }, 500);
  }
});

export default app;
