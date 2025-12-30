// =========================================================
// 预约管理 API
// =========================================================

import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare("SELECT * FROM bookings ORDER BY booking_time DESC")
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
      deviceModel,
      problemDescription,
      bookingTime,
    } = await c.req.json();

    // 验证必填字段
    if (!customerName || !phoneNumber || !deviceModel || !bookingTime) {
      return c.json(
        {
          success: false,
          error: "缺少必填字段",
        },
        400
      );
    }

    // 转换时间戳
    const timestamp = Math.floor(new Date(bookingTime).getTime() / 1000);

    const result = await c.env.luna_web_store
      .prepare(
        `INSERT INTO bookings 
       (customer_name, phone_number, device_model, problem_description, booking_time, status) 
       VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        customerName,
        phoneNumber,
        deviceModel,
        problemDescription || null,
        timestamp,
        "pending"
      )
      .run();

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
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

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

    const result = await c.env.luna_web_store
      .prepare("UPDATE bookings SET status = ? WHERE id = ?")
      .bind(status, id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "预约不存在" }, 404);
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

    const result = await c.env.luna_web_store
      .prepare("DELETE FROM bookings WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "预约不存在" }, 404);
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
