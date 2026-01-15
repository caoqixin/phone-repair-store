import { useState } from "react";
import { apiDelete, apiPut } from "../../services/auth.service";
import { Appointment } from "../../types";
import { Check, Clock, Edit, Loader2, Trash2, X } from "lucide-react";
import { useToast } from "../ToastProvider";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { AppointmentData } from "../../loader/appointments";
import dayjs from "dayjs";

export const AppointmentsView = () => {
  const { showToast } = useToast();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { appointments } = useLoaderData() as AppointmentData;

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");

  const updateStatus = async (
    id: number,
    status: string,
    email: string,
    time: number,
    customerName: string
  ) => {
    setLoadingId(id);
    try {
      await apiPut(`/bookings/${id}`, { status, email, time, customerName });
      showToast("预约状态已更新");
      revalidator.revalidate();
    } catch (e) {
      showToast("操作失败", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (
    id: number,
    email: string,
    bookingTime: number,
    customerName: string
  ) => {
    if (!window.confirm("确定删除此预约?")) return;
    try {
      await apiDelete(`/bookings/${id}`, { email, bookingTime, customerName });
      showToast("预约已删除");
      revalidator.revalidate();
    } catch (e) {
      showToast("删除失败", "error");
    }
  };

  const handleTimeUpdate = async () => {
    if (!editingAppointment || !newDate || !newTime) return;

    try {
      setLoadingId(editingAppointment.id);
      // 组合日期和时间为时间戳
      const dateTimeStr = `${newDate}T${newTime}`;
      const timestamp = dayjs(dateTimeStr).valueOf();

      if (isNaN(timestamp)) {
        showToast("时间和日期无效", "error");
        return;
      }

      await apiPut(`/bookings/${editingAppointment.id}`, {
        time: timestamp,
      });

      showToast("时间修改成功", "success");
      setEditingAppointment(null);
      revalidator.revalidate();
    } catch (error) {
      console.error(error);
      showToast("时间预约失败", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-slate-50 text-slate-600 border-slate-200",
    };
    const labels: Record<string, string> = {
      pending: "待确认",
      confirmed: "已确认",
      completed: "已完成",
      cancelled: "已取消",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
          styles[status] || styles.pending
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const openEditModal = (appointment: Appointment) => {
    const date = dayjs(appointment.booking_time);

    // 获取本地年份、月份、日期
    const localDate = date.format("YYYY-MM-DD");

    // 获取本地时间 HH:mm
    const localTime = date.format("HH:mm");

    setNewDate(localDate);
    setNewTime(localTime);
    setEditingAppointment(appointment);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">预约管理</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">客户信息</th>
              <th className="px-6 py-4">设备 / 问题</th>
              <th className="px-6 py-4">预约时间</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  暂无预约数据
                </td>
              </tr>
            ) : (
              appointments.map((app: Appointment) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">
                      {app.customer_name}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {app.phone_number}
                    </div>
                    <div className="text-slate-600 text-xs mt-0.5">
                      {app.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">
                      {app.device_model}
                    </div>
                    {app.problem_description && (
                      <div className="text-slate-500 text-xs mt-1 line-clamp-2">
                        {app.problem_description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="size-3.5 text-primary-500" />
                      {dayjs(app.booking_time).format("DD/MM/YYYY HH:mm")}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {app.status !== "cancelled" &&
                        app.status === "pending" && (
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="修改时间"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                      {app.status === "pending" && (
                        <button
                          disabled={loadingId === app.id}
                          onClick={() =>
                            updateStatus(
                              app.id,
                              "confirmed",
                              app.email,
                              app.booking_time,
                              app.customer_name
                            )
                          }
                          className="bg-primary-50 text-primary-700 hover:bg-primary-100 p-2 rounded-lg transition-colors disabled:opacity-50"
                          title="确认预约"
                        >
                          {loadingId === app.id ? (
                            <Loader2 className="animate-spin size-4" />
                          ) : (
                            <Check className="size-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(
                            app.id,
                            app.email,
                            app.booking_time,
                            app.customer_name
                          )
                        }
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="删除预约"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">重新预约时间</h3>
              <button
                onClick={() => setEditingAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日期
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  时间
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  取消
                </button>
                <button
                  onClick={handleTimeUpdate}
                  disabled={loadingId === editingAppointment.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingId === editingAppointment.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "保存"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
