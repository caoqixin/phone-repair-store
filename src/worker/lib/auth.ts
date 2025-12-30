import { Context } from "hono";
import { sign } from "hono/jwt";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  // 将 salt 和 hash 组合存储
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(salt);

  const combined = [...saltArray, ...hashArray];
  return btoa(String.fromCharCode(...combined));
}
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const originalHash = combined.slice(16);

    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const newHashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const newHash = new Uint8Array(newHashBuffer);

    // 比较哈希值
    if (newHash.length !== originalHash.length) return false;

    for (let i = 0; i < newHash.length; i++) {
      if (newHash[i] !== originalHash[i]) return false;
    }

    return true;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

// =========================================================
// Token 生成辅助函数
// =========================================================

export async function generateTokens(
  c: Context,
  userId: number,
  username: string
): Promise<{ accessToken: string; refreshToken: string }> {
  // Access Token - 15分钟过期
  const accessTokenPayload = {
    id: userId,
    username: username,
    type: "access",
    exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15分钟
  };

  // Refresh Token - 7天过期
  const refreshTokenPayload = {
    id: userId,
    username: username,
    type: "refresh",
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7天
  };

  const accessToken = await sign(
    accessTokenPayload,
    c.env.JWT_SECRET || "your-secret-key"
  );
  const refreshToken = await sign(
    refreshTokenPayload,
    c.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
  );

  return { accessToken, refreshToken };
}
