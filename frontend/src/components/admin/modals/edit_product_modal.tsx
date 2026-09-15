"use client";
import { useState } from "react";
import { Product, FormData, Vendor } from "@/src/interfaces/product";
import { ICategory } from "@/src/interfaces/category";
export default function EditProductModal({
  isOpen,
  onClose,
  product,
  categories,
  vendors,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  categories: ICategory[];
  vendors: Vendor[];
  onUpdate: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    id: product?.id || "",
    name: product?.name || "",
    description: product?.description || "",
    category_id: product?.category.id || "",
    vendor_id: product?.vendor.id || "",
    base_price: product?.base_price || 0,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-mono">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.3em] mb-1">
              System_Override // ID: {product?.id}
            </div>
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">
              Edit <span className="text-cyan-500">_Hardware_Config_</span>
            </h2>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1 md:col-span-2">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Asset_Name
            </label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all uppercase font-bold"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Data_Description
            </label>
            <textarea
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all text-xs uppercase"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Category
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-700 font-bold uppercase"
              // Fontos: a value a kiválasztott ID vagy név legyen a state-ből
              value={product?.category?.id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
            >
              <option value="" disabled className="bg-slate-900 text-slate-500">
                SELECT_CATEGORY...
              </option>

              {categories?.map((cat: ICategory) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-slate-900 text-white"
                >
                  {cat.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Manufacturer_ID
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-700 font-bold uppercase"
              // Fontos: a value a kiválasztott ID vagy név legyen a state-ből
              value={product?.category.id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
            >
              <option value="" disabled className="bg-slate-900 text-slate-500">
                SELECT_VENDOR...
              </option>

              {vendors?.map((ven: Vendor) => (
                <option
                  key={ven.id}
                  value={ven.id}
                  className="bg-slate-900 text-white"
                >
                  {ven.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Base_Unit_Price ($)
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-cyan-500 font-bold focus:border-cyan-500 outline-none transition-all"
              value={formData.base_price}
              onChange={(e) =>
                setFormData({ ...formData, base_price: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex gap-4">
          <button
            onClick={() => {
              onUpdate(formData);
              onClose();
            }}
            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-900/20"
          >
            Apply_Changes
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-transparent border border-slate-800 text-slate-500 hover:text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
