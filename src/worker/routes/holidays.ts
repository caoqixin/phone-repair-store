import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare(
        "SELECT * FROM holidays WHERE is_active = 1 ORDER BY start_date ASC"
      )
      .all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Get holidays error:", error);
    return c.json({ success: false, error: "获取节假日失败" }, 500);
  }
});

app.get("/all", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare("SELECT * FROM holidays ORDER BY start_date DESC")
      .all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Get all holidays error:", error);
    return c.json({ success: false, error: "获取节假日失败" }, 500);
  }
});

app.post("/", authMiddleware, async (c) => {
  try {
    const { name, startDate, endDate, isActive } = await c.req.json();
    if (!name || !startDate || !endDate) {
      return c.json({ success: false, error: "缺少必填字段" }, 400);
    }
    const result = await c.env.luna_web_store
      .prepare(
        "INSERT INTO holidays (name, start_date, end_date, is_active) VALUES (?, ?, ?, ?)"
      )
      .bind(
        name,
        startDate,
        endDate,
        isActive !== undefined ? (isActive ? 1 : 0) : 1
      )
      .run();
    return c.json(
      {
        success: true,
        message: "节假日创建成功",
        data: { id: result.meta.last_row_id },
      },
      201
    );
  } catch (error) {
    console.error("Create holiday error:", error);
    return c.json({ success: false, error: "创建节假日失败" }, 500);
  }
});

app.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const result = await c.env.luna_web_store
      .prepare("DELETE FROM holidays WHERE id = ?")
      .bind(id)
      .run();
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "节假日不存在" }, 404);
    }
    return c.json({ success: true, message: "节假日删除成功" });
  } catch (error) {
    console.error("Delete holiday error:", error);
    return c.json({ success: false, error: "删除节假日失败" }, 500);
  }
});

export default app;
