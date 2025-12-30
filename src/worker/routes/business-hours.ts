import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare("SELECT * FROM business_hours ORDER BY day_of_week ASC")
      .all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Get business hours error:", error);
    return c.json({ success: false, error: "获取营业时间失败" }, 500);
  }
});

app.put("/:dayOfWeek", authMiddleware, async (c) => {
  try {
    const dayOfWeek = c.req.param("dayOfWeek");
    const { isOpen, morningOpen, morningClose, afternoonOpen, afternoonClose } =
      await c.req.json();
    const result = await c.env.luna_web_store
      .prepare(
        `INSERT OR REPLACE INTO business_hours (day_of_week, is_open, morning_open, morning_close, afternoon_open, afternoon_close) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        dayOfWeek,
        isOpen ? 1 : 0,
        morningOpen || null,
        morningClose || null,
        afternoonOpen || null,
        afternoonClose || null
      )
      .run();
    return c.json({ success: true, message: "营业时间更新成功", data: result });
  } catch (error) {
    console.error("Update business hours error:", error);
    return c.json({ success: false, error: "更新营业时间失败" }, 500);
  }
});

export default app;
