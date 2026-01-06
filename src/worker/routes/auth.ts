import { Hono } from "hono";
import { generateTokens, hashPassword, verifyPassword } from "../lib/auth";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { authMiddleware } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/setup-status", async (c) => {
  try {
    const settings = await c.env.luna_web_store
      .prepare("SELECT * FROM settings WHERE key = 'is_initialized'")
      .first();

    const result = {
      [settings?.key as string]: Number(settings?.value as number),
    };

    const isInitialized = result?.is_initialized == 1;

    return c.json({ success: true, initialized: isInitialized });
  } catch (error) {
    return c.json({ success: false });
  }
});

// =========================================================
// 1. 登录接口
// =========================================================
app.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json(
        {
          success: false,
          error: "用户名和密码不能为空",
        },
        400
      );
    }

    // 查询用户
    const user = await c.env.luna_web_store
      .prepare("SELECT * FROM users WHERE username = ?")
      .bind(username)
      .first<{
        id: number;
        username: string;
        password_hash: string;
      }>();

    if (!user) {
      return c.json(
        {
          success: false,
          error: "用户名错误",
        },
        401
      );
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return c.json(
        {
          success: false,
          error: "密码错误",
        },
        401
      );
    }

    // 生成双 Token
    const { accessToken, refreshToken } = await generateTokens(
      c,
      user.id,
      user.username
    );

    setCookie(c, "access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 15 * 60, // 15分钟
      path: "/",
    });

    setCookie(c, "refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: "/",
    });

    return c.json({
      success: true,
      message: "登录成功",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
        },
        expiresIn: 900, // 15分钟（秒）
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      {
        success: false,
        error: "服务器错误",
      },
      500
    );
  }
});

// =========================================================
// 2. 刷新 Token 接口
// =========================================================
app.post("/refresh", authMiddleware, async (c) => {
  try {
    // 从 Cookie 或 Body 获取 refresh token
    const refreshToken =
      getCookie(c, "refresh_token") || (await c.req.json()).refreshToken;

    if (!refreshToken) {
      return c.json(
        {
          success: false,
          error: "未提供 Refresh Token",
        },
        401
      );
    }

    // 验证 refresh token
    const payload = await verify(
      refreshToken,
      c.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
    );

    if (payload.type !== "refresh") {
      return c.json(
        {
          success: false,
          error: "Token 类型错误",
        },
        401
      );
    }

    // 检查是否过期
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json(
        {
          success: false,
          error: "Refresh Token 已过期，请重新登录",
        },
        401
      );
    }

    // 验证用户是否仍然存在
    const user = await c.env.luna_web_store
      .prepare("SELECT id, username FROM users WHERE id = ?")
      .bind(payload.id)
      .first<{ id: number; username: string }>();

    if (!user) {
      return c.json(
        {
          success: false,
          error: "用户不存在",
        },
        401
      );
    }

    // 生成新的双 Token
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      c,
      user.id,
      user.username
    );

    // 更新 Cookies
    setCookie(c, "access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 15 * 60,
      path: "/",
    });

    setCookie(c, "refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return c.json({
      success: true,
      message: "Token 刷新成功",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return c.json(
      {
        success: false,
        error: "Refresh Token 无效或已过期",
      },
      401
    );
  }
});

// =========================================================
// 3. 登出接口（清除所有 Token）
// =========================================================
app.post("/logout", authMiddleware, (c) => {
  deleteCookie(c, "access_token", { path: "/" });
  deleteCookie(c, "refresh_token", { path: "/" });

  return c.json({
    success: true,
    message: "登出成功",
  });
});

// =========================================================
// 4. 验证 Access Token 接口
// =========================================================
app.get("/verify", authMiddleware, async (c) => {
  try {
    const token =
      getCookie(c, "access_token") ||
      c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json(
        {
          success: false,
          error: "未登录",
        },
        401
      );
    }

    const payload = await verify(token, c.env.JWT_SECRET || "your-secret-key");

    if (payload.type !== "access") {
      return c.json(
        {
          success: false,
          error: "Token 类型错误",
        },
        401
      );
    }

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json(
        {
          success: false,
          error: "Access Token 已过期",
          code: "TOKEN_EXPIRED",
        },
        401
      );
    }

    return c.json({
      success: true,
      data: {
        user: {
          id: payload.id,
          username: payload.username,
        },
        expiresAt: payload.exp,
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Token 无效",
      },
      401
    );
  }
});

// =========================================================
// 5. 创建管理员接口（使用 bcrypt 加密）
// =========================================================
app.post("/create-admin", async (c) => {
  try {
    // 安全检查：如果已经初始化过，禁止再次调用
    const settings = await c.env.luna_web_store
      .prepare("SELECT * FROM settings WHERE key = 'is_initialized'")
      .first();

    const settingResult = {
      [settings?.key as string]: Number(settings?.value as number),
    };

    if (settingResult?.is_initialized === 1) {
      return c.json(
        { success: false, error: "System already initialized" },
        403
      );
    }

    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json(
        {
          success: false,
          error: "用户名和密码不能为空",
        },
        400
      );
    }

    if (password.length < 6) {
      return c.json(
        {
          success: false,
          error: "密码长度至少6位",
        },
        400
      );
    }

    // 检查用户是否已存在
    const existingAdmin = await c.env.luna_web_store
      .prepare("SELECT id FROM users WHERE username = ?")
      .bind(username)
      .first();

    if (existingAdmin) {
      return c.json(
        {
          success: false,
          error: "用户名已存在",
        },
        409
      );
    }

    // 使用 bcrypt 加密密码
    const passwordHash = await hashPassword(password);

    const result = await c.env.luna_web_store.batch([
      c.env.luna_web_store
        .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
        .bind(username, passwordHash),
      c.env.luna_web_store.prepare(
        "UPDATE settings SET value = 1 WHERE key = 'is_initialized'"
      ),
    ]);

    return c.json({
      success: true,
      message: "管理员创建成功",
      data: {
        id: result[0].meta.last_row_id,
        username,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return c.json({ success: false, error: "服务器错误" }, 500);
  }
});

// =========================================================
// 6. 获取当前用户信息
// =========================================================
app.get("/me", authMiddleware, async (c) => {
  try {
    const token =
      getCookie(c, "access_token") ||
      c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json({ success: false, error: "未登录" }, 401);
    }

    const payload = await verify(token, c.env.JWT_SECRET || "your-secret-key");

    const admin = await c.env.luna_web_store
      .prepare("SELECT id, username FROM users WHERE id = ?")
      .bind(payload.id)
      .first<{ id: number; username: string }>();

    if (!admin) {
      return c.json({ success: false, error: "用户不存在" }, 404);
    }

    return c.json({
      success: true,
      data: {
        user: admin,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: "Token 无效" }, 401);
  }
});

export default app;
