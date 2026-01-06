import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import { authMiddleware } from "./middleware/auth";
import { loginLoader } from "./loader/login";
import { layoutLoader } from "./loader/layout";
import { homeLoader } from "./loader/home";
import { bookingAction } from "./actions/booking";
import { contactLoader } from "./loader/contact";
import { contactAction } from "./actions/contact";
import { aboutLoader } from "./loader/about";
import { serviceLoader } from "./loader/service";
import { loginAction } from "./actions/login";
import { dashboardLoader } from "./loader/dashboard";
import Setup from "./pages/admin/Setup";
import { setupLoader } from "./loader/setup";
import { setupAction } from "./actions/setup";

// 定义路由配置 (Data Router)
// 将 router 定义在组件外部，避免重渲染时重建实例
const router = createBrowserRouter([
  {
    // 公共前台区域 - 使用 Layout 布局
    element: <Layout />,
    loader: layoutLoader,
    children: [
      {
        path: "/",
        loader: homeLoader,
        element: <Home />,
      },
      {
        path: "/services",
        loader: serviceLoader,
        element: <Services />,
      },
      {
        path: "/booking",
        action: bookingAction,
        element: <Booking />,
      },
      {
        path: "/contact",
        loader: contactLoader,
        action: contactAction,
        element: <Contact />,
      },
      {
        path: "/about",
        loader: aboutLoader,
        element: <About />,
      },
    ],
  },
  {
    // 后台管理区域 - 独立路由 (不使用前台 Layout)
    path: "/admin",
    children: [
      {
        path: "setup",
        element: <Setup />,
        loader: setupLoader,
        action: setupAction,
      },
      {
        path: "login",
        loader: loginLoader,
        action: loginAction,
        element: <Login />,
      },
      {
        path: "dashboard",
        middleware: [authMiddleware],
        loader: dashboardLoader,
        element: <Dashboard />,
      },
      // 访问 /admin 时默认跳转到登录页
      {
        index: true,
        element: <Navigate to="/admin/login" replace />,
      },
    ],
  },
  {
    // 404 Fallback
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  const { i18n } = useTranslation();

  // Set HTML lang attribute based on current language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <RouterProvider router={router} />;
}

export default App;
