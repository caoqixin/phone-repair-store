import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { apiPut } from "../../services/auth.service";
import { ContactMessage } from "../../types";
import { useToast } from "../ToastProvider";
import { MessageData } from "../../loader/message";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

export const MessagesView = () => {
  const { showToast } = useToast();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { messages } = useLoaderData() as MessageData;

  const markAsRead = async (id: number) => {
    try {
      await apiPut(`/contacts/${id}/read`, {});
      showToast("已标记为已读");
      revalidator.revalidate();
    } catch (error) {
      showToast("操作失败", "error");
    }
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
      <h2 className="text-2xl font-bold mb-6 text-slate-800">客户留言</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">客户</th>
              <th className="px-6 py-4">留言内容</th>
              <th className="px-6 py-4 w-32">时间</th>
              <th className="px-6 py-4 w-24 text-center">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  暂无留言
                </td>
              </tr>
            ) : (
              messages.map((msg: ContactMessage) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-slate-50 ${
                    !msg.is_read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{msg.name}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {msg.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 leading-relaxed">
                    {msg.message}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {dayjs
                      .unix(messages[0].created_at)
                      .format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {!msg.is_read ? (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        标为已读
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">已读</span>
                    )}
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
