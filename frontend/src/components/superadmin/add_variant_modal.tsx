"use client";
import { useState } from "react";
import { X, Plus, Zap, Box, Activity, Loader2 } from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  basePrice: number;
  onUpdate: () => void;
}

export default function AddVariantModal({
  isOpen,
  onClose,
  productId,
  basePrice,
  onUpdate,
}: AddVariantModalProps) {
  const [formData, setFormData] = useState({
    variant_sku: "",
    stock: 0,
    price_modifier: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.variant_sku) {
      toast.error("SKU_REQUIRED: Please enter a unique identifier");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/api/addProductVariant", {
        product_id: productId,
        ...formData,
      });
      toast.success("NEW_VARIANT_INITIALIZED");
      setFormData({
        variant_sku: "",
        stock: 0,
        price_modifier: 0,
      });
      onUpdate();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.errors[0] || "INITIALIZATION_FAILURE");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const finalPrice = basePrice + Number(formData.price_modifier);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-mono text-white">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plus size={14} className="text-cyan-500" />
              <span className="text-[10px] text-cyan-500/50 font-black uppercase tracking-[0.4em]">
                Unit_Initialization_Sequence
              </span>
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Create_New <span className="text-cyan-500">_VARIANT_</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest ml-1">
                Registry_SKU
              </label>
              <div className="relative">
                <Box
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  type="text"
                  placeholder="E.G. MOD-X100"
                  value={formData.variant_sku}
                  onChange={(e) =>
                    setFormData({ ...formData, variant_sku: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-cyan-500 outline-none transition-all uppercase placeholder:text-slate-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest ml-1">
                Initial_Stock
              </label>
              <div className="relative">
                <Activity
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-cyan-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="w-full md:w-1/2 space-y-2">
                <label className="text-[9px] text-cyan-500 font-black uppercase tracking-widest ml-1">
                  Price_Modifier ($)
                </label>
                <input
                  type="number"
                  value={formData.price_modifier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_modifier: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/20 rounded-2xl py-4 px-6 text-xl font-black text-cyan-400 focus:border-cyan-500 outline-none transition-all"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-center border-l border-slate-800 md:pl-8">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                  Calculated_Market_Value
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black italic text-white tracking-tighter">
                    ${finalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800/50 flex gap-4 bg-slate-900/50">
          <button
            onClick={onClose}
            className="flex-1 py-4 border border-slate-800 text-slate-500 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all"
          >
            Abort
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Zap size={14} />
            )}
            Initialize_Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
