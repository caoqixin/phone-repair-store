import { useState } from "react";
import { ServiceCategory, ServiceItem } from "../../types";
import { apiDelete, apiPost, apiPut } from "../../services/auth.service";
import { Edit, Plus, Settings, Trash2, X } from "lucide-react";
import { ToastType } from "../ToastProvider";

interface ServicesViewProps {
  data: ServiceItem[];
  categories: ServiceCategory[];
  refresh: () => void;
  showToast: (msg: string, type?: ToastType) => void;
}

export const ServicesView = ({
  data,
  categories,
  refresh,
  showToast,
}: ServicesViewProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState<Partial<ServiceItem>>({});

  const handleEdit = (item?: ServiceItem) => {
    setEditing(item || null);
    setForm(
      item || {
        category: categories[0]?.slug || "",
        icon_name: "Wrench",
        title_it: "",
        title_cn: "",
        description_it: "",
        description_cn: "",
        price_display: "",
        order: 0,
        is_active: 1,
      }
    );
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await apiPut(`/services/${editing.id}`, form);
      } else {
        await apiPost("/services", form);
      }
      setModalOpen(false);
      showToast("服务已保存");
      refresh();
    } catch (error) {
      showToast("保存失败", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定删除此服务?")) return;
    try {
      await apiDelete(`/services/${id}`);
      showToast("服务已删除");
      refresh();
    } catch (error) {
      showToast("删除失败", "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">服务项目</h2>
        <button
          onClick={() => handleEdit()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all"
        >
          <Plus className="size-4" /> 添加服务
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((s: ServiceItem) => {
          const category = categories.find(
            (c: ServiceCategory) => c.slug === s.category
          );
          return (
            <div
              key={s.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="bg-primary-50 text-primary-600 size-12 rounded-xl flex items-center justify-center mb-2">
                    <Settings className="size-6" />
                  </div>
                  {category && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {category.name_cn}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                {s.title_cn}
              </h3>
              <h4 className="text-sm font-medium text-slate-400 mb-3">
                {s.title_it}
              </h4>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {s.description_cn}
              </p>
              {s.price_display && (
                <div className="mt-3 text-primary-600 font-bold">
                  {s.price_display}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editing ? "编辑服务" : "添加新服务"}
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
                  分类
                </label>
                <select
                  required
                  value={form.category || ""}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {categories.map((cat: ServiceCategory) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name_cn} / {cat.name_it}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="标题 (IT)"
                  required
                  value={form.title_it || ""}
                  onChange={(e) =>
                    setForm({ ...form, title_it: e.target.value })
                  }
                  className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <input
                  placeholder="标题 (CN)"
                  required
                  value={form.title_cn || ""}
                  onChange={(e) =>
                    setForm({ ...form, title_cn: e.target.value })
                  }
                  className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <textarea
                  placeholder="描述 (IT)"
                  value={form.description_it || ""}
                  onChange={(e) =>
                    setForm({ ...form, description_it: e.target.value })
                  }
                  className="p-2.5 border border-slate-200 rounded-lg h-24 resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <textarea
                  placeholder="描述 (CN)"
                  value={form.description_cn || ""}
                  onChange={(e) =>
                    setForm({ ...form, description_cn: e.target.value })
                  }
                  className="p-2.5 border border-slate-200 rounded-lg h-24 resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <input
                placeholder="价格显示 (如: da €50)"
                value={form.price_display || ""}
                onChange={(e) =>
                  setForm({ ...form, price_display: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
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
