"use client";
import { useState } from "react";
import EditCategoryModal from "./edit_category_modal";
import api from "@/src/axios";
import { ICategory, IFormData } from "@/src/interfaces/category";
import { toast } from "sonner";

interface CategoryCardProps {
  category: ICategory;
  fetchCategories: () => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  allCategories: ICategory[];
}

export default function CategoryCard({
  category,
  fetchCategories,
  onToggleStatus,
  allCategories,
}: CategoryCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleSave = async (updatedData: IFormData) => {
    const promise = api.put("/api/updateCategory", updatedData);

    toast.promise(promise, {
      loading: "UPDATING_CATEGORY...",
      success: (res) => {
        fetchCategories();
        setEditModalOpen(false);
        return res.data.msg;
      },
      error: (error) => {
        return error.data.msg;
      },
    });
  };

  return (
    <div
      className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
        category.is_active
          ? "bg-slate-900/40 border-slate-800 hover:border-cyan-500/50"
          : "bg-slate-950 border-red-900/30 opacity-80"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest border ${
            category.is_active
              ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
              : "text-red-500 border-red-500/20 bg-red-500/5"
          }`}
        >
          {category.is_active ? "●_Active_Node" : "○_Inactive_Offline"}
        </div>
        <div className="text-[10px] text-slate-600 font-mono">
          ID: {category.id}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
          {category.name}
        </h3>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditModalOpen(true);
            }}
            className="p-2 bg-slate-800 hover:bg-cyan-600 text-slate-400 hover:text-white rounded-lg transition-all"
            title="Edit Category"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          <button
            onClick={() => onToggleStatus(category.id, category.is_active)}
            className={`p-2 rounded-lg transition-all ${
              category.is_active
                ? "bg-slate-800 hover:bg-red-900/40 text-red-500"
                : "bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white"
            }`}
            title={category.is_active ? "Deactivate" : "Activate"}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        </div>
      </div>
      <EditCategoryModal
        key={category.id}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        category={category}
        onSave={handleSave}
        allCategories={allCategories}
      />
    </div>
  );
}
