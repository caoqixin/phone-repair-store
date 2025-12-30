import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

// 获取所有消息（需要认证）
app.get("/", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare("SELECT * FROM contacts ORDER BY created_at DESC")
      .all();

    return c.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    return c.json({ success: false, error: "获取留言失败" }, 500);
  }
});

// 提交留言（公开接口）
app.post("/", async (c) => {
  try {
    const { name, email, message } = await c.req.json();

    // 验证必填字段
    if (!name || !email || !message) {
      return c.json(
        {
          success: false,
          error: "缺少必填字段",
        },
        400
      );
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json(
        {
          success: false,
          error: "邮箱格式不正确",
        },
        400
      );
    }

    const result = await c.env.luna_web_store
      .prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)")
      .bind(name, email, message)
      .run();

    return c.json(
      {
        success: true,
        message: "留言提交成功",
        data: {
          id: result.meta.last_row_id,
        },
      },
      201
    );
  } catch (error) {
    console.error("Create contact error:", error);
    return c.json({ success: false, error: "提交留言失败" }, 500);
  }
});

// 标记留言为已读（需要认证）
app.put("/:id/read", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");

    const result = await c.env.luna_web_store
      .prepare("UPDATE contacts SET is_read = 1 WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "留言不存在" }, 404);
    }

    return c.json({
      success: true,
      message: "已标记为已读",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return c.json({ success: false, error: "标记失败" }, 500);
  }
});

// 删除留言（需要认证）
app.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");

    const result = await c.env.luna_web_store
      .prepare("DELETE FROM contacts WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "留言不存在" }, 404);
    }

    return c.json({
      success: true,
      message: "留言删除成功",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    return c.json({ success: false, error: "删除留言失败" }, 500);
  }
});

export default app;
