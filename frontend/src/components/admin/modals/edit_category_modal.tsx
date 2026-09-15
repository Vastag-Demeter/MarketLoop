"use client";
import { useState } from "react";
import { ICategory, IFormData } from "@/src/interfaces/category";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategory;
  allCategories: ICategory[];
  onSave: (formData: IFormData) => void;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  allCategories,
  onSave,
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parent_id: category.parent_id,
  });

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/[^\w-]+/g, "");
    setFormData({ ...formData, name: val, slug: slug });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-2xl shadow-[0_0_50px_-15px_rgba(6,182,212,0.2)] overflow-hidden">
        <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-cyan-600 font-black uppercase tracking-[0.3em] mb-1">
              Database_Node_Configuration
            </div>
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">
              Edit <span className="text-cyan-500">_Category_</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block ml-1">
              Protocol_Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
              placeholder="e.g. Hardware_Modules"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block ml-1">
              URL_Access_Slug
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">
                /
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-xs text-cyan-500/80 font-mono focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block ml-1">
              Parent_Hierarchy_Link
            </label>
            <select
              value={formData.parent_id}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  parent_id: Number(e.target.value) || undefined,
                });
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">-- ROOT_LEVEL (No Parent) --</option>
              {allCategories
                .filter((c) => c.id !== category?.id) // Ne lehessen önmaga a szülője
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
            >
              Update_Node_Data
            </button>
            <button
              onClick={onClose}
              className="px-8 bg-slate-900 border border-slate-800 text-slate-400 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
            >
              Abort
            </button>
          </div>
        </div>

        <div className="bg-slate-900/30 p-4 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-700 uppercase tracking-[0.2em]">
          <span>Auth_Level: Admin_High_Priority</span>
          <span className="animate-pulse">● System_Live</span>
        </div>
      </div>
    </div>
  );
}
