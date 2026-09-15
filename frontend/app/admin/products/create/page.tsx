"use client";
import { useEffect, useState } from "react";
import api from "@/src/axios";
import { useRouter } from "next/navigation";
import { ICategory } from "@/src/interfaces/category";
import { Vendor } from "@/src/interfaces/product";
export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    vendor_id: "",
    base_price: "",
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, venRes] = await Promise.all([
          api.get("/api/getActiveCategories"),
          api.get("/api/getVendors"),
        ]);
        setCategories(catRes.data.data);
        setVendors(venRes.data.data);
      } catch (err) {
        console.error("Hiba a metaadatok letöltésekor:", err);
      }
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Átalakítjuk az adatokat a backend számára
    const dataToSubmit = {
      ...formData,
      category_id: parseInt(formData.category_id), // String -> Integer
      vendor_id: parseInt(formData.vendor_id), // String -> Integer
      base_price: parseFloat(formData.base_price), // String -> Float/Decimal
    };

    try {
      await api.post("/api/addProduct", dataToSubmit);
      router.push("/products");
    } catch (err) {
      console.error("Beküldési hiba:", err);
      alert("SYSTEM_ERROR: Data type mismatch or injection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputStyle =
    "w-full bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl text-white font-mono text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-700";
  const labelStyle =
    "block text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-2 ml-1 font-bold";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900/20 border border-slate-800/60 p-10 rounded-3xl backdrop-blur-xl shadow-2xl z-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${loading ? "bg-amber-500 animate-ping" : "bg-cyan-500 animate-pulse"}`}
            />
            <span className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.4em]">
              {loading
                ? "Processing_Request..."
                : "System_Admin // Product_Entry"}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Create <span className="text-cyan-500">New_Item</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Serial_SKU</label>
              <input
                required
                name="sku"
                type="text"
                placeholder="EXP-2024-X"
                className={inputStyle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelStyle}>Base_Price_USD</label>
              <input
                required
                name="base_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={inputStyle}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Hardware_Label</label>
            <input
              required
              name="name"
              type="text"
              placeholder="Enter product name..."
              className={inputStyle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelStyle}>Technical_Specifications</label>
            <textarea
              required
              name="description"
              rows={3}
              placeholder="Detailed parameters..."
              className={`${inputStyle} resize-none`}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Category_Type</label>
              <select
                required
                name="category_id"
                className={inputStyle}
                onChange={handleChange}
                value={formData.category_id}
              >
                <option value="" className="bg-slate-900">
                  Select Category
                </option>
                {categories.map((cat: ICategory) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Authorized_Vendor</label>
              <select
                required
                name="vendor_id"
                className={inputStyle}
                onChange={handleChange}
                value={formData.vendor_id}
              >
                <option value="" className="bg-slate-900">
                  Select Vendor
                </option>
                {vendors.map((v: Vendor) => (
                  <option key={v.id} value={v.id} className="bg-slate-900">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-black rounded-xl uppercase tracking-[0.3em] transition-all transform active:scale-[0.98] shadow-lg
                ${
                  loading
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-cyan-900/20"
                }
              `}
            >
              {loading ? "Executing_Entry..." : "Upload_to_Database"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
