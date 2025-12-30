import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare(
        'SELECT * FROM carriers WHERE is_active = 1 ORDER BY "order" ASC'
      )
      .all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Get carriers error:", error);
    return c.json({ success: false, error: "获取快递公司失败" }, 500);
  }
});

app.get("/all", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare('SELECT * FROM carriers ORDER BY "order" ASC')
      .all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Get all carriers error:", error);
    return c.json({ success: false, error: "获取快递公司失败" }, 500);
  }
});

app.post("/", authMiddleware, async (c) => {
  try {
    const { name, trackingUrl, order, isActive } = await c.req.json();
    if (!name || !trackingUrl) {
      return c.json({ success: false, error: "缺少必填字段" }, 400);
    }
    const result = await c.env.luna_web_store
      .prepare(
        'INSERT INTO carriers (name, tracking_url, "order", is_active) VALUES (?, ?, ?, ?)'
      )
      .bind(
        name,
        trackingUrl,
        order || 0,
        isActive !== undefined ? (isActive ? 1 : 0) : 1
      )
      .run();
    return c.json(
      {
        success: true,
        message: "快递公司创建成功",
        data: { id: result.meta.last_row_id },
      },
      201
    );
  } catch (error) {
    console.error("Create carrier error:", error);
    return c.json({ success: false, error: "创建快递公司失败" }, 500);
  }
});

app.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    const updates: string[] = [];
    const values: any[] = [];
    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.tracking_url !== undefined) {
      updates.push("tracking_url = ?");
      values.push(data.tracking_url);
    }
    if (data.order !== undefined) {
      updates.push('"order" = ?');
      values.push(data.order);
    }
    if (data.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(data.is_active ? 1 : 0);
    }
    if (updates.length === 0) {
      return c.json({ success: false, error: "没有要更新的字段" }, 400);
    }
    values.push(id);
    const result = await c.env.luna_web_store
      .prepare(`UPDATE carriers SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "快递公司不存在" }, 404);
    }
    return c.json({ success: true, message: "快递公司更新成功" });
  } catch (error) {
    console.error("Update carrier error:", error);
    return c.json({ success: false, error: "更新快递公司失败" }, 500);
  }
});

app.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const result = await c.env.luna_web_store
      .prepare("DELETE FROM carriers WHERE id = ?")
      .bind(id)
      .run();
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "快递公司不存在" }, 404);
    }
    return c.json({ success: true, message: "快递公司删除成功" });
  } catch (error) {
    console.error("Delete carrier error:", error);
    return c.json({ success: false, error: "删除快递公司失败" }, 500);
  }
});

export default app;
