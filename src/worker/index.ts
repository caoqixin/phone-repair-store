import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import AuthRoute from "./routes/auth";
import BookingsRoute from "./routes/bookings";
import ServicesRoute from "./routes/services";
import CategoriesRoute from "./routes/categories";
import CarriersRoute from "./routes/carriers";
import BusinessHoursRoute from "./routes/business-hours";
import HolidaysRoute from "./routes/holidays";
import ContactsRoute from "./routes/contacts";
import SettingsRoute from "./routes/settings";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

// 全局中间件
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// 健康检查
app.get("/", (c) => {
  return c.json({
    message: "Phone Repair Shop API",
    version: "1.0.0",
  });
});

app.route("/auth", AuthRoute);
// =========================================================
// 预约管理 API
// =========================================================

app.route("/bookings", BookingsRoute);

// =========================================================
// 服务项目 API
// =========================================================
app.route("/services", ServicesRoute);

// =========================================================
// 服务分类 API
// =========================================================
app.route("/categories", CategoriesRoute);

// =========================================================
// 快递公司 API
// =========================================================
app.route("/carriers", CarriersRoute);

// =========================================================
// 营业时间 API
// =========================================================
app.route("/business-hours", BusinessHoursRoute);

// =========================================================
// 节假日 API
// =========================================================
app.route("/holidays", HolidaysRoute);
// =========================================================
// 联系消息 API
// =========================================================
app.route("/contacts", ContactsRoute);
// =========================================================
// 系统设置 API
// =========================================================
app.route("/settings", SettingsRoute);
// =========================================================
// 错误处理
// =========================================================
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json(
    {
      success: false,
      error: "服务器内部错误",
    },
    500
  );
});

app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "路由不存在",
    },
    404
  );
});

export default app;
