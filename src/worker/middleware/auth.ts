import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";

// JWT Payload 类型
export type JWTPayload = {
  id: number;
  username: string;
  type: "access" | "refresh";
  exp: number;
};

// 扩展 Context Variables
export type Variables = {
  user: JWTPayload;
};

// =========================================================
// 认证中间件（强制要求有效的 Access Token）
// =========================================================
export const authMiddleware = async (
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) => {
  try {
    // 从 Cookie 或 Authorization header 获取 access token
    const token =
      getCookie(c, "access_token") ||
      c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json(
        {
          success: false,
          error: "未登录，请先登录",
          code: "NO_TOKEN",
        },
        401
      );
    }

    // 验证 access token
    const payload = (await verify(
      token,
      c.env.JWT_SECRET || "your-secret-key"
    )) as JWTPayload;

    // 验证 token 类型
    if (payload.type !== "access") {
      return c.json(
        {
          success: false,
          error: "Token 类型错误",
          code: "INVALID_TOKEN_TYPE",
        },
        401
      );
    }

    // 检查 token 是否过期
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json(
        {
          success: false,
          error: "Access Token 已过期，请使用 Refresh Token 刷新",
          code: "TOKEN_EXPIRED",
        },
        401
      );
    }

    // 将用户信息存入 context
    c.set("user", payload);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json(
      {
        success: false,
        error: "Token 无效或已过期",
        code: "INVALID_TOKEN",
      },
      401
    );
  }
};
