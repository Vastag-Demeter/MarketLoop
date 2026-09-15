"use client";
import { useAuth } from "@/src/context/AuthContext";
import EditProductModal from "./admin/modals/edit_product_modal";
import { Product, Vendor, FormData } from "../interfaces/product";
import { ICategory } from "../interfaces/category";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import api from "../axios";
import { Layers, Pencil, Power } from "lucide-react"; // Új ikonok a tisztább UX-hez

import Link from "next/link";

export default function ProductCard({
  product,
  categories,
  vendors,
  onUpdate,
  onStatusChange,
}: {
  product: Product;
  categories: ICategory[];
  vendors: Vendor[];
  onUpdate: (data: FormData) => void;
  onStatusChange: () => void;
}) {
  const { user, isAdmin } = useAuth();
  const isInactive = !product.is_active;
  const shouldShowAsDisabled = isInactive && isAdmin;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeactive = async () => {
    const promise = api.put("/api/changeProductActiveness", { id: product.id });
    toast.promise(promise, {
      loading: "CHANGING_ACTIVENESS...",
      success: (res) => {
        onStatusChange();
        return res.data.msg;
      },
      error: (error) => {
        return error.data.error || "ACTIVENESS_CHANGE_FAILED";
      },
    });
  };

  return (
    <div
      className={`
      group relative bg-slate-900/50 border rounded-2xl overflow-hidden transition-all duration-500 shadow-xl flex flex-col h-full
      ${
        shouldShowAsDisabled
          ? "border-rose-900/30 opacity-60 grayscale-[0.5]"
          : "border-slate-800 hover:border-cyan-500/50"
      }
    `}
    >
      <div className="aspect-square bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 relative">
        <Image
          src={product.images?.[0]?.url || "/api/placeholder/400/400"}
          fill
          loading="eager"
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 
            ${shouldShowAsDisabled ? "opacity-40" : "opacity-80 group-hover:scale-110 group-hover:opacity-100"}
          `}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {isInactive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
            <div
              className={`px-3 py-1 border rounded text-[10px] font-black uppercase tracking-[0.3em] shadow-lg
                ${
                  isAdmin
                    ? "bg-slate-900/80 border-cyan-500 text-cyan-500"
                    : "bg-rose-600/20 border-rose-500/50 text-rose-500"
                }`}
            >
              {isAdmin ? "Status: Offline" : "System_Offline"}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3
            className={`font-bold text-lg tracking-tight uppercase transition-colors line-clamp-2 
            ${shouldShowAsDisabled ? "text-slate-600" : "text-white group-hover:text-cyan-400"}`}
          >
            {product.name}
          </h3>
          <span
            className={`${shouldShowAsDisabled ? "text-slate-700" : "text-cyan-500"} font-mono text-sm font-black shrink-0`}
          >
            ${product.base_price}
          </span>
        </div>

        <p className="text-slate-500 text-xs mb-6 line-clamp-2 uppercase tracking-wider leading-relaxed">
          {product.description ||
            "High-performance hardware optimized for the loop."}
        </p>

        <div className="mt-auto pt-4 space-y-2">
          {isAdmin ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 border border-slate-700 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  className={`flex items-center justify-center gap-2 py-2.5 border text-[10px] font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 ${
                    !isInactive
                      ? "border-rose-500/50 text-rose-500 hover:bg-rose-500/10"
                      : "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
                  }`}
                  onClick={handleDeactive}
                >
                  <Power size={12} />
                  {isInactive ? "Wake" : "Sleep"}
                </button>
              </div>

              <Link
                href={`/admin/products/variants/${product.id}`}
                className="block"
              >
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] hover:bg-cyan-500/20 transition-all active:scale-[0.98]">
                  <Layers size={14} />
                  Manage_Variants
                </button>
              </Link>
            </>
          ) : (
            <Link href={`/products/details/${product.id}`}>
              <button
                disabled={isInactive}
                className={`w-full py-3 border text-[10px] font-black rounded-xl uppercase tracking-[0.2em] transition-all duration-300
                ${
                  isInactive
                    ? "bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed"
                    : "bg-slate-800 border-slate-700 text-white hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]"
                }
              `}
              >
                SELECT_OPTIONS
              </button>
            </Link>
          )}
        </div>
      </div>

      <EditProductModal
        key={product.id}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={product}
        categories={categories}
        vendors={vendors}
        onUpdate={onUpdate}
      />
    </div>
  );
}
