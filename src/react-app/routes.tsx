import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./components/Layout";
import { authMiddleware } from "./middleware/auth";
import { layoutLoader } from "./loader/layout";

// 定义路由配置 (Data Router)
// 将 router 定义在组件外部，避免重渲染时重建实例
export const router = createBrowserRouter([
  {
    // 公共前台区域 - 使用 Layout 布局
    element: <Layout />,
    loader: layoutLoader,
    children: [
      {
        path: "/",
        lazy: async () => {
          const [Component, loader] = await Promise.all([
            import("./pages/Home"),
            import("./loader/home"),
          ]);
          return { Component: Component.default, loader: loader.homeLoader };
        },
      },
      {
        path: "/services",
        lazy: async () => {
          const [Component, loader] = await Promise.all([
            import("./pages/Services"),
            import("./loader/service"),
          ]);
          return { Component: Component.default, loader: loader.serviceLoader };
        },
      },
      {
        path: "/booking",
        lazy: async () => {
          const [Component, action] = await Promise.all([
            import("./pages/Booking"),
            import("./actions/booking"),
          ]);
          return { Component: Component.default, action: action.bookingAction };
        },
      },
      {
        path: "/contact",
        lazy: async () => {
          const [Component, loader, action] = await Promise.all([
            import("./pages/Contact"),
            import("./loader/contact"),
            import("./actions/contact"),
          ]);
          return {
            Component: Component.default,
            loader: loader.contactLoader,
            action: action.contactAction,
          };
        },
      },
      {
        path: "/about",
        lazy: async () => {
          const [Component, loader] = await Promise.all([
            import("./pages/About"),
            import("./loader/about"),
          ]);
          return { Component: Component.default, loader: loader.aboutLoader };
        },
      },
    ],
  },
  {
    // 后台管理区域 - 独立路由 (不使用前台 Layout)
    path: "/admin",
    children: [
      {
        path: "setup",
        lazy: async () => {
          const [Component, loader, action] = await Promise.all([
            import("./pages/admin/Setup"),
            import("./loader/setup"),
            import("./actions/setup"),
          ]);
          return {
            Component: Component.default,
            loader: loader.setupLoader,
            action: action.setupAction,
          };
        },
      },
      {
        path: "login",
        lazy: async () => {
          const [Component, loader, action] = await Promise.all([
            import("./pages/admin/Login"),
            import("./loader/login"),
            import("./actions/login"),
          ]);
          return {
            Component: Component.default,
            loader: loader.loginLoader,
            action: action.loginAction,
          };
        },
      },
      {
        path: "dashboard",
        middleware: [authMiddleware],
        lazy: async () => {
          const [Component, loader] = await Promise.all([
            import("./components/admin/AdminLayout"),
            import("./loader/aside"),
          ]);
          return {
            Component: Component.default,
            loader: loader.asideLoader,
          };
        },
        children: [
          {
            index: true,
            element: <Navigate to="appointments" replace />,
          },
          {
            path: "appointments",
            lazy: async () => {
              const [Component, loader] = await Promise.all([
                import("./components/admin/AppointmentsView"),
                import("./loader/appointments"),
              ]);
              return {
                Component: Component.AppointmentsView,
                loader: loader.appointmentsLoader,
              };
            },
          },
          {
            path: "services",
            lazy: async () => {
              const [Component, loader] = await Promise.all([
                import("./components/admin/ServicesView"),
                import("./loader/services"),
              ]);
              return {
                Component: Component.ServicesView,
                loader: loader.servicesLoader,
              };
            },
          },
          {
            path: "carriers",
            lazy: async () => {
              const [Component, loader] = await Promise.all([
                import("./components/admin/CarriersView"),
                import("./loader/carriers"),
              ]);
              return {
                Component: Component.CarriersView,
                loader: loader.carriersLoader,
              };
            },
          },
          {
            path: "messages",
            lazy: async () => {
              const [Component, loader] = await Promise.all([
                import("./components/admin/MessageView"),
                import("./loader/message"),
              ]);
              return {
                Component: Component.MessagesView,
                loader: loader.messageLoader,
              };
            },
          },
          {
            path: "settings",
            lazy: async () => {
              const [Component, loader] = await Promise.all([
                import("./components/admin/SettingsView"),
                import("./loader/settings"),
              ]);
              return {
                Component: Component.SettingsView,
                loader: loader.settingsLoader,
              };
            },
          },
        ],
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
