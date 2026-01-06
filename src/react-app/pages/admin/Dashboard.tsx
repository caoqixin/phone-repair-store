import React, { useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router";
import {
  LogOut,
  Calendar,
  MessageSquare,
  Settings,
  Layout,
  Menu,
  Loader2,
  User,
  Truck,
} from "lucide-react";
import { logout } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { ToastProvider, useToast } from "../../components/ToastProvider";

import { AppointmentsView } from "../../components/admin/AppointmentsView";
import { ServicesView } from "../../components/admin/ServicesView";
import { CarriersView } from "../../components/admin/CarriersView";
import { MessagesView } from "../../components/admin/MessageView";
import { SettingsView } from "../../components/admin/SettingsView";
import { DashboardData } from "../../loader/dashboard";

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "appointments" | "services" | "carriers" | "messages" | "settings"
  >("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const {
    appointments,
    messages,
    services,
    carriers,
    categories,
    businessHours,
    holidays,
    settings,
  } = useLoaderData() as DashboardData;

  const revalidator = useRevalidator();

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      id: "appointments",
      label: "预约管理",
      icon: Calendar,
      count: appointments.filter((a) => a.status === "pending").length,
    },
    { id: "services", label: "服务项目", icon: Layout },
    { id: "carriers", label: "快递公司", icon: Truck },
    {
      id: "messages",
      label: "客户留言",
      icon: MessageSquare,
      count: messages.filter((m) => !m.is_read).length,
    },
    { id: "settings", label: "网站设置", icon: Settings },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">验证登录状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-slate-900 text-white transition-all duration-300 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="size-3 bg-primary-500 rounded-full animate-pulse"></span>
              LunaTech Admin
            </h1>
          ) : (
            <span className="size-3 bg-primary-500 rounded-full"></span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                activeTab === item.id
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`size-5 shrink-0 ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-slate-500 group-hover:text-white"
                }`}
              />
              {isSidebarOpen && (
                <span className="font-medium flex-1 text-left flex justify-between">
                  {item.label}
                  {item.count ? (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full flex items-center justify-center min-w-5">
                      {item.count}
                    </span>
                  ) : null}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <LogOut className="size-5" />
            {isSidebarOpen && <span className="font-medium">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              {user?.username || "Admin User"}
            </div>
            <div className="size-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
              <User className="size-4" />
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 text-primary-600 animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === "appointments" && (
                <AppointmentsView
                  data={appointments}
                  refresh={revalidator.revalidate}
                  showToast={showToast}
                />
              )}
              {activeTab === "services" && (
                <ServicesView
                  data={services}
                  categories={categories}
                  refresh={revalidator.revalidate}
                  showToast={showToast}
                />
              )}
              {activeTab === "carriers" && (
                <CarriersView
                  data={carriers}
                  refresh={revalidator.revalidate}
                  showToast={showToast}
                />
              )}
              {activeTab === "messages" && (
                <MessagesView
                  data={messages}
                  refresh={revalidator.revalidate}
                  showToast={showToast}
                />
              )}
              {activeTab === "settings" && (
                <SettingsView
                  data={settings}
                  businessHours={businessHours}
                  holidays={holidays}
                  refresh={revalidator.revalidate}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const Dashboard: React.FC = () => (
  <ToastProvider>
    <DashboardContent />
  </ToastProvider>
);

export default Dashboard;
