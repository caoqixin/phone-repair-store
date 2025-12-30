import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Loader2, Moon, User } from "lucide-react";
import { login } from "../../services/auth.service";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 验证输入
    if (!username.trim()) {
      setError("请输入用户名");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("请输入密码");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(username, password);

      if (result.success) {
        // 登录成功，跳转到管理后台
        navigate("/admin/dashboard");
      } else {
        // 登录失败，显示错误信息
        setError(result.error || "登录失败，请重试");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-50 p-4 rounded-2xl mb-4 shadow-inner">
            <Moon className="size-8 text-primary-600" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
          <p className="text-slate-500 text-sm">请登录以访问管理后台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* 用户名输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 size-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                  error && !username.trim()
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200"
                }`}
                placeholder="输入用户名"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 密码输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 size-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                  error && !password.trim()
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200"
                }`}
                placeholder="输入密码"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-slide-in">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin size-5" /> 登录中...
              </>
            ) : (
              "登录 Dashboard"
            )}
          </button>
        </form>

        {/* 提示信息 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            首次登录？默认用户名:{" "}
            <span className="font-mono text-slate-600">admin</span>
          </p>
        </div>

        <div className="mt-4 text-center border-t border-slate-100 pt-4">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-primary-600 transition-colors"
          >
            ← 返回前台首页
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
