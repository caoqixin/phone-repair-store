import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

// 获取所有设置（公开接口）
app.get("/", async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare("SELECT * FROM settings")
      .all();

    const settings: Record<string, string> = {};
    for (const row of results as Array<{ key: string; value: string }>) {
      settings[row.key] = row.value;
    }

    return c.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return c.json({ success: false, error: "获取设置失败" }, 500);
  }
});

// 更新单个设置（需要认证）
app.put("/:key", authMiddleware, async (c) => {
  try {
    const key = c.req.param("key");
    const { value } = await c.req.json();

    if (value === undefined) {
      return c.json({ success: false, error: "缺少 value 字段" }, 400);
    }

    await c.env.luna_web_store
      .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
      .bind(key, value)
      .run();

    return c.json({
      success: true,
      message: "设置更新成功",
    });
  } catch (error) {
    console.error("Update setting error:", error);
    return c.json({ success: false, error: "更新设置失败" }, 500);
  }
});

// 批量更新设置（需要认证）
app.post("/batch", authMiddleware, async (c) => {
  try {
    const settings = await c.req.json<Record<string, string>>();

    if (!settings || typeof settings !== "object") {
      return c.json({ success: false, error: "无效的设置数据" }, 400);
    }

    // 准备批量插入语句
    const statements = Object.entries(settings).map(([key, value]) =>
      c.env.luna_web_store
        .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
        .bind(key, value)
    );

    // 批量执行
    await c.env.luna_web_store.batch(statements);

    return c.json({
      success: true,
      message: "设置批量更新成功",
    });
  } catch (error) {
    console.error("Batch update settings error:", error);
    return c.json({ success: false, error: "批量更新失败" }, 500);
  }
});
export default app;
