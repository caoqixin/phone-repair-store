import { useState } from "react";
import { Carrier } from "../../types";
import { apiDelete, apiPost, apiPut } from "../../services/auth.service";
import { Edit, Loader2, Package, Plus, Trash2, X } from "lucide-react";
import { useToast } from "../ToastProvider";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { CarrierData } from "../../loader/carriers";

export const CarriersView = () => {
  const { showToast } = useToast();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { carriers } = useLoaderData() as CarrierData;

  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Carrier | null>(null);
  const [form, setForm] = useState<Partial<Carrier>>({});

  const handleEdit = (item?: Carrier) => {
    setEditing(item || null);
    setForm(item || { name: "", tracking_url: "", order: 0, is_active: 1 });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await apiPut(`/carriers/${editing.id}`, form);
      } else {
        await apiPost("/carriers", form);
      }
      setModalOpen(false);
      showToast("快递公司已保存");
      revalidator.revalidate();
    } catch (error) {
      showToast("保存失败", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定删除此快递公司?")) return;
    try {
      await apiDelete(`/carriers/${id}`);
      showToast("快递公司已删除");
      revalidator.revalidate();
    } catch (error) {
      showToast("删除失败", "error");
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">快递公司管理</h2>
        <button
          onClick={() => handleEdit()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all"
        >
          <Plus className="size-4" /> 添加快递公司
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">快递公司名称</th>
              <th className="px-6 py-4">查询URL</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {carriers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  暂无快递公司
                </td>
              </tr>
            ) : (
              carriers.map((carrier: Carrier) => (
                <tr
                  key={carrier.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="size-5 text-primary-500" />
                      <span className="font-bold text-slate-900">
                        {carrier.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-50 px-2 py-1 rounded font-mono text-slate-600">
                      {carrier.tracking_url}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        carrier.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {carrier.is_active ? "激活" : "禁用"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(carrier)}
                        className="bg-primary-50 text-primary-700 hover:bg-primary-100 p-2 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(carrier.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="删除"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editing ? "编辑快递公司" : "添加快递公司"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  公司名称
                </label>
                <input
                  placeholder="DHL, UPS, FedEx..."
                  required
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  查询URL
                </label>
                <input
                  placeholder="https://example.com/track?id="
                  required
                  type="url"
                  value={form.tracking_url || ""}
                  onChange={(e) =>
                    setForm({ ...form, tracking_url: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                  快递单号将自动附加到此URL末尾
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="carrier_active"
                  checked={form.is_active === 1}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked ? 1 : 0 })
                  }
                  className="size-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="carrier_active"
                  className="text-sm text-slate-700"
                >
                  激活此快递公司
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-lg shadow-primary-900/20"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
