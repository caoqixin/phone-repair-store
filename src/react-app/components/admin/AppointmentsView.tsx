import { useState } from "react";
import { apiDelete, apiPut } from "../../services/auth.service";
import { Appointment } from "../../types";
import { Check, Clock, Loader2, Trash2 } from "lucide-react";
import { ToastType } from "../ToastProvider";

interface AppointmentsViewProps {
  data: Appointment[];
  refresh: () => void;
  showToast: (msg: string, type?: ToastType) => void;
}

export const AppointmentsView = ({
  data,
  refresh,
  showToast,
}: AppointmentsViewProps) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

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
      refresh();
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
      refresh();
    } catch (e) {
      showToast("删除失败", "error");
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
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  暂无预约数据
                </td>
              </tr>
            ) : (
              data.map((app: Appointment) => (
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
                      {new Date(app.booking_time * 1000).toLocaleString(
                        "zh-CN"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
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
    </div>
  );
};
