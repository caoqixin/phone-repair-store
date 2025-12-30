import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
// =========================================================
// 服务项目 API
// =========================================================
const app = new Hono<{ Bindings: Env }>();

// 获取所有服务（公开接口）
app.get("/", async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare(
        'SELECT * FROM services WHERE is_active = 1 ORDER BY "order" ASC'
      )
      .all();

    return c.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get services error:", error);
    return c.json({ success: false, error: "获取服务失败" }, 500);
  }
});

// 获取所有服务（包括未激活，需要认证）
app.get("/all", authMiddleware, async (c) => {
  try {
    const { results } = await c.env.luna_web_store
      .prepare('SELECT * FROM services ORDER BY "order" ASC')
      .all();

    return c.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get all services error:", error);
    return c.json({ success: false, error: "获取服务失败" }, 500);
  }
});

// 创建服务（需要认证）
app.post("/", authMiddleware, async (c) => {
  try {
    const {
      category,
      iconName,
      titleIt,
      titleCn,
      descriptionIt,
      descriptionCn,
      priceDisplay,
      order,
      isActive,
    } = await c.req.json();

    // 验证必填字段
    if (!category || !titleIt || !titleCn) {
      return c.json(
        {
          success: false,
          error: "缺少必填字段",
        },
        400
      );
    }

    const result = await c.env.luna_web_store
      .prepare(
        `INSERT INTO services 
       (category, icon_name, title_it, title_cn, description_it, description_cn, price_display, "order", is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        category,
        iconName || "Wrench",
        titleIt,
        titleCn,
        descriptionIt || null,
        descriptionCn || null,
        priceDisplay || null,
        order || 0,
        isActive !== undefined ? (isActive ? 1 : 0) : 1
      )
      .run();

    return c.json(
      {
        success: true,
        message: "服务创建成功",
        data: {
          id: result.meta.last_row_id,
        },
      },
      201
    );
  } catch (error) {
    console.error("Create service error:", error);
    return c.json({ success: false, error: "创建服务失败" }, 500);
  }
});

// 更新服务（需要认证）
app.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();

    // 构建动态更新语句
    const updates: string[] = [];
    const values: any[] = [];

    if (data.category !== undefined) {
      updates.push("category = ?");
      values.push(data.category);
    }
    if (data.icon_name !== undefined) {
      updates.push("icon_name = ?");
      values.push(data.icon_name);
    }
    if (data.title_it !== undefined) {
      updates.push("title_it = ?");
      values.push(data.title_it);
    }
    if (data.title_cn !== undefined) {
      updates.push("title_cn = ?");
      values.push(data.title_cn);
    }
    if (data.description_it !== undefined) {
      updates.push("description_it = ?");
      values.push(data.description_it);
    }
    if (data.description_cn !== undefined) {
      updates.push("description_cn = ?");
      values.push(data.description_cn);
    }
    if (data.price_display !== undefined) {
      updates.push("price_display = ?");
      values.push(data.price_display);
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
      .prepare(`UPDATE services SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "服务不存在" }, 404);
    }

    return c.json({
      success: true,
      message: "服务更新成功",
    });
  } catch (error) {
    console.error("Update service error:", error);
    return c.json({ success: false, error: "更新服务失败" }, 500);
  }
});

// 删除服务（需要认证）
app.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");

    const result = await c.env.luna_web_store
      .prepare("DELETE FROM services WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "服务不存在" }, 404);
    }

    return c.json({
      success: true,
      message: "服务删除成功",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    return c.json({ success: false, error: "删除服务失败" }, 500);
  }
});

export default app;
