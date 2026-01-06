interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      username: string;
    };
    expiresIn: number;
  };
  error?: string;
}

interface RefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: string;
  code?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// =========================================================
// 配置
// =========================================================

const TOKEN_REFRESH_BEFORE_EXPIRY = 2 * 60 * 1000; // 提前 2 分钟刷新
const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const EXPIRY_TOKEN = "token_expiry";
let refreshTimer: number | null = null;

// =========================================================
// Token 存储
// =========================================================
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN);
}

function setTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn?: number
): void {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);

  // 保存 token 过期时间（秒）
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem("token_expiry", expiryTime.toString());
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(EXPIRY_TOKEN);
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

// 获取 Token 剩余有效时间（毫秒）
function getTokenRemainingTime(): number {
  const expiryTime = localStorage.getItem("token_expiry");
  if (!expiryTime) {
    return 0;
  }
  const remaining = parseInt(expiryTime) - Date.now();
  return remaining > 0 ? remaining : 0;
}

// =========================================================
// 自动刷新调度
// =========================================================
function scheduleTokenRefresh(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const remainingTime = getTokenRemainingTime();

  if (remainingTime === 0) {
    console.warn("Token 已过期或过期时间未知，使用默认刷新间隔");
    // 使用默认值：15分钟 - 2分钟 = 13分钟
    const defaultRefreshTime = 15 * 60 * 1000 - TOKEN_REFRESH_BEFORE_EXPIRY;

    refreshTimer = window.setTimeout(async () => {
      console.log("Auto refreshing access token (default schedule)...");
      await handleTokenRefresh();
    }, defaultRefreshTime);

    console.log(
      `Token 将在默认 ${defaultRefreshTime / 1000 / 60} 分钟后自动刷新`
    );
    return;
  }

  // 计算刷新时间：在过期前 TOKEN_REFRESH_BEFORE_EXPIRY 执行
  const refreshTime = remainingTime - TOKEN_REFRESH_BEFORE_EXPIRY;

  if (refreshTime <= 0) {
    // 如果已经在刷新窗口内，立即刷新
    console.log("Token 即将过期，立即刷新");
    handleTokenRefresh();
    return;
  }

  console.log(
    `Token 剩余有效时间: ${Math.floor(remainingTime / 1000 / 60)} 分钟，` +
      `将在 ${Math.floor(refreshTime / 1000 / 60)} 分钟后自动刷新`
  );

  refreshTimer = window.setTimeout(async () => {
    console.log("Auto refreshing access token...");
    await handleTokenRefresh();
  }, refreshTime);
}

// 处理 Token 刷新
async function handleTokenRefresh(): Promise<void> {
  const result = await refreshAccessToken();

  if (!result.success) {
    console.error("Failed to refresh token:", result.error);
    clearTokens();

    // 触发自定义事件，让应用知道需要重新登录
    window.dispatchEvent(new CustomEvent("auth:session-expired"));

    // 跳转到登录页
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}

// =========================================================
// 1. 登录
// =========================================================
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      }
    );

    const data: LoginResponse = await response.json();

    if (data.success && data.data) {
      setTokens(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.expiresIn // 保存过期时间（秒）
      );
      scheduleTokenRefresh();
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "网络错误，请稍后重试",
    };
  }
}

// =========================================================
// 2. 刷新 Token
// =========================================================
export async function refreshAccessToken(): Promise<RefreshResponse> {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        error: "未找到 Refresh Token",
        code: "NO_REFRESH_TOKEN",
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data: RefreshResponse = await response.json();

    if (data.success && data.data) {
      setTokens(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.expiresIn // 保存新的过期时间
      );
      scheduleTokenRefresh();
      return data;
    } else {
      // Refresh token 过期，清除登录状态
      if (data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN") {
        clearTokens();
      }
      return data;
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return {
      success: false,
      error: "刷新失败",
    };
  }
}

// =========================================================
// 3. 登出
// =========================================================
export async function logout(): Promise<void> {
  try {
    const token = getAccessToken();
    if (token) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearTokens();
  }
}

// =========================================================
// 4. 验证 Token
// =========================================================
export async function verifyToken(): Promise<ApiResponse> {
  try {
    const token = getAccessToken();

    if (!token) {
      return {
        success: false,
        error: "未登录",
        code: "NO_TOKEN",
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/verify`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Verify token error:", error);
    return {
      success: false,
      error: "验证失败",
    };
  }
}

// =========================================================
// 5. 获取当前用户信息
// =========================================================
export async function getCurrentUser(): Promise<ApiResponse> {
  try {
    const token = getAccessToken();

    if (!token) {
      return {
        success: false,
        error: "未登录",
        code: "NO_TOKEN",
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      success: false,
      error: "获取用户信息失败",
    };
  }
}

// =========================================================
// 6. 检查是否已登录
// =========================================================
export function isAuthenticated(): boolean {
  return !!getAccessToken() && !!getRefreshToken();
}

// =========================================================
// 7. 带认证的 Fetch（自动刷新）
// =========================================================
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  // 添加 Authorization header
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 确保 URL 以 /api 开头
  const fullUrl = url.startsWith("/api")
    ? url
    : `${import.meta.env.VITE_API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  });

  // 如果返回 401，尝试刷新 token 并重试
  if (response.status === 401) {
    const errorData = await response.clone().json();

    if (errorData.code === "TOKEN_EXPIRED") {
      console.log("Access token expired, refreshing...");

      const refreshResult = await refreshAccessToken();

      if (refreshResult.success) {
        // 使用新 token 重试
        const newToken = getAccessToken();
        headers.set("Authorization", `Bearer ${newToken}`);

        return fetch(fullUrl, {
          ...options,
          headers,
          credentials: "include",
        });
      } else {
        // 刷新失败，跳转到登录页
        clearTokens();
        window.location.href = "/login";
        throw new Error("Token refresh failed");
      }
    }
  }

  return response;
}

// =========================================================
// 9. 便捷的 API 请求方法
// =========================================================
export async function apiGet<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await authenticatedFetch(url, {
    ...options,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function apiPost<T = any>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await authenticatedFetch(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function apiPut<T = any>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await authenticatedFetch(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function apiDelete<T = any>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await authenticatedFetch(url, {
    ...options,
    method: "DELETE",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// =========================================================
// 10. 初始化（自动启动刷新）
// =========================================================
export function initAuth(): void {
  if (isAuthenticated()) {
    scheduleTokenRefresh();
  }
}

// 页面加载时自动初始化
if (typeof window !== "undefined") {
  initAuth();
}
