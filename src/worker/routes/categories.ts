import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
// =========================================================
// 服务分类 API
// =========================================================
const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare('SELECT * FROM service_categories ORDER BY "order" ASC')
      .all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Get categories error:", error);
    return c.json({ success: false, error: "获取分类失败" }, 500);
  }
});

app.post("/", authMiddleware, async (c) => {
  try {
    const { nameIt, nameCn, slug, order } = await c.req.json();
    if (!nameIt || !nameCn || !slug) {
      return c.json({ success: false, error: "缺少必填字段" }, 400);
    }
    const result = await c.env.luna_web_store
      .prepare(
        'INSERT INTO service_categories (name_it, name_cn, slug, "order") VALUES (?, ?, ?, ?)'
      )
      .bind(nameIt, nameCn, slug, order || 0)
      .run();
    return c.json(
      {
        success: true,
        message: "分类创建成功",
        data: { id: result.meta.last_row_id },
      },
      201
    );
  } catch (error) {
    console.error("Create category error:", error);
    return c.json({ success: false, error: "创建分类失败" }, 500);
  }
});

app.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const result = await c.env.luna_web_store
      .prepare("DELETE FROM service_categories WHERE id = ?")
      .bind(id)
      .run();
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "分类不存在" }, 404);
    }
    return c.json({ success: true, message: "分类删除成功" });
  } catch (error) {
    console.error("Delete category error:", error);
    return c.json({ success: false, error: "删除分类失败" }, 500);
  }
});

export default app;
