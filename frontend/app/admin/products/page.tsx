"use client";
import { useState, useEffect, useCallback } from "react";
import { Product, Vendor, FormData } from "@/src/interfaces/product";
import { ICategory } from "@/src/interfaces/category";
import api from "@/src/axios";
import ProductCard from "@/src/components/product_card";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filter, setFilter] = useState("all"); // all, active, inactive

  const fetchAllProducts = useCallback(async () => {
    const res = await api.get("/api/getAllProducts");
    setProducts(res.data.data);
  }, []);

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await api.get("/api/getCategories");
      setCategories(res.data.data);
    };

    const fetchAllVendors = async () => {
      const res = await api.get("/api/getVendors");
      setVendors(res.data.data);
    };

    fetchAllProducts();
    fetchAllCategories();
    fetchAllVendors();
  }, [fetchAllProducts]);

  const filteredProducts = products.filter((p) => {
    if (filter === "active") return p.is_active;
    if (filter === "inactive") return !p.is_active;
    return true;
  });

  const handleUpdateProduct = async (updatedData: FormData) => {
    const promise = api.put("/api/updateProducts", updatedData);
    toast.promise(promise, {
      loading: "UPDATING_CODE_DATABASE...",
      success: (res) => {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === updatedData.id ? { ...p, ...res.data.data } : p,
          ),
        );
        return res.data.msg;
      },
      error: (err) => err.response?.data?.error || "UPDATE_FAILED",
    });
  };
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic text-white">
              Inventory <span className="text-cyan-500">Master</span>
            </h1>
            <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
              {"//"} Total_Items: {products.length}
            </p>
          </div>
          <Link href="/admin/products/create">
            <button className="group relative px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95 flex items-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative">Create_New_Node</span>
            </button>
          </Link>

          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* TERMÉK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={categories}
              vendors={vendors}
              onUpdate={handleUpdateProduct}
              onStatusChange={fetchAllProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
