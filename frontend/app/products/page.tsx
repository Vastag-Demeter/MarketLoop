"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/src/axios";
import ProductCard from "@/src/components/product_card";
import { Product, Vendor } from "@/src/interfaces/product";
import { ICategory } from "@/src/interfaces/category";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const activeCategoryId = searchParams.get("category") || "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, vendRes] = await Promise.all([
        api.get("/api/getActiveProducts"),
        api.get("/api/getActiveCategories"),
        api.get("/api/getVendors"),
      ]);

      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
      setVendors(vendRes.data.data);
    } catch (err) {
      console.error("__DATA_SYNC_ERROR__:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log(products);
  }, [products]);

  // Kategória váltás ID alapján
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Összehasonlítás: product.category.id (szám) vs activeCategoryId (string az URL-ből)
      const matchesCategory = activeCategoryId
        ? product.category?.id.toString() === activeCategoryId
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategoryId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="pt-24 pb-8 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
          Market_<span className="text-cyan-500">Database</span>
        </h1>

        <div className="max-w-md mx-auto mt-8 relative group">
          <input
            type="text"
            placeholder="ENTER_HARDWARE_NAME..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 py-4 px-6 rounded-2xl text-sm font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 transition-all shadow-2xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeCategoryId === ""
                ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            [All_Sectors]
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              // Itt az ID-t adjuk át a függvénynek
              onClick={() => handleCategoryChange(cat.id.toString())}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                // Az összehasonlítás stringként történik az URL miatt
                activeCategoryId === cat.id.toString()
                  ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* TERMÉK RÁCS */}
      <div className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-slate-900/20 rounded-3xl border border-slate-900"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={() => {}}
                onStatusChange={fetchData}
                categories={categories}
                vendors={vendors}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
