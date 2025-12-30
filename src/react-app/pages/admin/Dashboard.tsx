import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
import { logout, apiGet } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { ToastProvider, useToast } from "../../components/ToastProvider";
import {
  Appointment,
  BusinessHour,
  Carrier,
  ContactMessage,
  Holiday,
  ServiceCategory,
  ServiceItem,
} from "../../types";
import { AppointmentsView } from "../../components/admin/AppointmentsView";
import { ServicesView } from "../../components/admin/ServicesView";
import { CarriersView } from "../../components/admin/CarriersView";
import { MessagesView } from "../../components/admin/MessageView";
import { SettingsView } from "../../components/admin/SettingsView";

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "appointments" | "services" | "carriers" | "messages" | "settings"
  >("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    if (isAuthenticated) {
      loadData();
    }
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [isAuthenticated, authLoading, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        appointmentsRes,
        messagesRes,
        servicesRes,
        categoriesRes,
        carriersRes,
        businessHoursRes,
        holidaysRes,
        settingsRes,
      ] = await Promise.all([
        apiGet<{ success: boolean; data: Appointment[] }>("/bookings"),
        apiGet<{ success: boolean; data: ContactMessage[] }>("/contacts"),
        apiGet<{ success: boolean; data: ServiceItem[] }>("/services/all"),
        apiGet<{ success: boolean; data: ServiceCategory[] }>("/categories"),
        apiGet<{ success: boolean; data: Carrier[] }>("/carriers/all"),
        apiGet<{ success: boolean; data: BusinessHour[] }>("/business-hours"),
        apiGet<{ success: boolean; data: Holiday[] }>("/holidays/all"),
        apiGet<{ success: boolean; data: Record<string, string> }>("/settings"),
      ]);

      if (appointmentsRes.success) {
        setAppointments(
          appointmentsRes.data.sort((a, b) => b.created_at - a.created_at)
        );
      }
      if (messagesRes.success) setMessages(messagesRes.data);
      if (servicesRes.success) setServices(servicesRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (carriersRes.success) setCarriers(carriersRes.data);
      if (businessHoursRes.success) setBusinessHours(businessHoursRes.data);
      if (holidaysRes.success) setHolidays(holidaysRes.data);
      if (settingsRes.success) setSettings(settingsRes.data);
    } catch (error) {
      console.error("Load data error:", error);
      showToast("加载数据失败", "error");
    } finally {
      setIsLoading(false);
    }
  };

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
                  refresh={loadData}
                  showToast={showToast}
                />
              )}
              {activeTab === "services" && (
                <ServicesView
                  data={services}
                  categories={categories}
                  refresh={loadData}
                  showToast={showToast}
                />
              )}
              {activeTab === "carriers" && (
                <CarriersView
                  data={carriers}
                  refresh={loadData}
                  showToast={showToast}
                />
              )}
              {activeTab === "messages" && (
                <MessagesView
                  data={messages}
                  refresh={loadData}
                  showToast={showToast}
                />
              )}
              {activeTab === "settings" && (
                <SettingsView
                  data={settings}
                  businessHours={businessHours}
                  holidays={holidays}
                  refresh={loadData}
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
