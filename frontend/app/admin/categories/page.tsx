"use client";
import { useEffect, useState } from "react";
import { ICategory } from "@/src/interfaces/category";
import api from "@/src/axios";
import CategoryCard from "@/src/components/admin/modals/category_card";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/getCategories");
      setCategories(response.data.data);
    } catch (err: unknown) {
      console.error("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const promise = api.put("/api/changeCategoryActiveness", { id: id });

    toast.promise(promise, {
      loading: "UPDATING_CATEGORY_ACTIVENESS...",
      success: (res) => {
        fetchCategories();
        return res.data.msg;
      },
      error: (err) => {
        return err.data.error;
      },
    });
  };

  if (loading)
    return (
      <div className="p-12 text-cyan-500 font-mono animate-pulse">
        SYNCING_DATABASE...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">
              Category <span className="text-cyan-500">_Manager_</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase mt-1">
              System_Admin_Access_Only
            </p>
          </div>
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            + Create_New_Node
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: ICategory) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              fetchCategories={fetchCategories}
              allCategories={categories}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
