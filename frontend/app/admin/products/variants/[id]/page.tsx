"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  Plus,
  Package,
  Zap,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Power,
  X,
} from "lucide-react";
import api from "@/src/axios";
import { Product } from "@/src/interfaces/product";
import Link from "next/link";
import { toast } from "sonner";
import EditVariantModal from "@/src/components/admin/modals/edit_variant_modal";
import AddVariantModal from "@/src/components/superadmin/add_variant_modal"; // ÚJ IMPORT

interface ProductVariant {
  id: number;
  variant_sku: string;
  stock: number;
  price_modifier: number;
  is_active: boolean;
}

interface AttributeValue {
  attribute: {
    id: number;
    name: string;
  };
  value: string;
}

function VariantAttributes({
  variantId,
  refreshKey,
}: {
  variantId: number;
  refreshKey: number;
}) {
  const [attributes, setAttributes] = useState<AttributeValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttrs = async () => {
      try {
        const res = await api.get(
          `/api/attributeValuesByVariantId/${variantId}`,
        );
        setAttributes(res.data.data || []);
      } catch (err) {
        console.error(`ATTR_SYNC_ERROR_FOR_VARIANT_${variantId}`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttrs();
  }, [variantId, refreshKey]);

  if (loading)
    return (
      <div className="flex items-center gap-2 mt-2 opacity-50">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        <span className="text-[8px] uppercase tracking-widest font-bold text-slate-500">
          Retrieving_Specs...
        </span>
      </div>
    );

  if (attributes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {attributes.map((attr, idx) => (
        <div
          key={idx}
          className="flex items-center border border-cyan-500/20 bg-cyan-500/5 rounded-md px-2 py-0.5"
        >
          <span className="text-[8px] font-black text-cyan-500/50 uppercase mr-1.5 border-r border-cyan-500/20 pr-1.5">
            {attr.attribute.name}
          </span>
          <span className="text-[9px] font-bold text-cyan-300 uppercase italic">
            {attr.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ProductVariantsPage() {
  const params = useParams();
  const productId = typeof params.id === "string" ? params.id : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false); // ÚJ
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = async () => {
    if (!productId) return;
    try {
      const prodRes = await api.get(`/api/getProduct/${productId}`);
      setProduct(prodRes.data.data);

      const varRes = await api.get(
        `/api/getProductVariants/${parseInt(productId)}`,
      );
      setVariants(varRes.data.data || []);
      setRefreshKey(Date.now());
    } catch (error) {
      console.error("CRITICAL_DATA_SYNC_ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const handleEditClick = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsEditOpen(true);
  };

  const handleStatusToggleRequest = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsConfirmOpen(true);
  };

  const confirmStatusToggle = async () => {
    if (!selectedVariant) return;
    setIsActionLoading(true);
    try {
      await api.put(`/api/changeProductVariantActiveness`, {
        id: selectedVariant.id,
      });
      toast.success(
        `Variant_${selectedVariant.is_active ? "Deactivated" : "Activated"}_Success`,
      );
      fetchData();
      setIsConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Status_Update_Protocol_Failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-cyan-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <span className="tracking-[0.5em] uppercase text-[10px] font-black">
          Syncing_Variant_Database...
        </span>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-white font-mono p-12 text-center uppercase">
        Error: Registry_Entry_Missing
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Return_to_Registry
          </span>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-900 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-cyan-500 animate-pulse" size={20} />
              <span className="text-[10px] text-cyan-500/50 tracking-[0.4em] font-black uppercase">
                Variant_Management_Protocol
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              {product.name} <span className="text-cyan-500">_MODS_</span>
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">
              Base_Price_Reference
            </span>
            <span className="text-2xl font-black text-white">
              ${product.base_price}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
              <Layers size={24} />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                Active_Variants
              </div>
              <div className="text-xl font-black italic">
                {variants.length}_UNITS
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Package size={24} />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                Total_Stock_Sum
              </div>
              <div className="text-xl font-black italic">
                {variants.reduce((acc, curr) => acc + curr.stock, 0)}_PCS
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 group"
          >
            <Plus
              size={20}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />
            Initialize_New_Mod
          </button>
        </div>

        {variants.length > 0 ? (
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-500">
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black">
                    Status
                  </th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black">
                    Variant_Identity
                  </th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black">
                    Inventory
                  </th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black">
                    Pricing
                  </th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-right">
                    Commands
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="hover:bg-cyan-500/[0.02] transition-colors group"
                  >
                    <td className="p-5 align-top pt-7">
                      <button
                        onClick={() => handleStatusToggleRequest(variant)}
                        className="transition-transform active:scale-90"
                      >
                        {variant.is_active ? (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500 hover:text-emerald-400"
                          />
                        ) : (
                          <XCircle
                            size={18}
                            className="text-rose-500 opacity-30 hover:opacity-100"
                          />
                        )}
                      </button>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors tracking-widest uppercase text-sm">
                          {variant.variant_sku}
                        </span>
                        <VariantAttributes
                          variantId={variant.id}
                          refreshKey={refreshKey}
                        />
                      </div>
                    </td>
                    <td className="p-5 align-top pt-6">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-black ${variant.stock < 10 ? "text-rose-400 bg-rose-400/10" : "text-slate-400 bg-slate-800/50"}`}
                      >
                        {variant.stock}{" "}
                        <span className="text-[9px] opacity-60">Units</span>
                      </div>
                    </td>
                    <td className="p-5 align-top pt-7 font-mono font-bold text-cyan-500">
                      {variant.price_modifier >= 0
                        ? `+$${variant.price_modifier}`
                        : `-$${Math.abs(variant.price_modifier)}`}
                    </td>
                    <td className="p-5 text-right align-top pt-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(variant)}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center">
            <Layers size={32} className="text-slate-700 mb-4" />
            <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2">
              No Variants Detected
            </h3>
          </div>
        )}
      </div>

      {isConfirmOpen && selectedVariant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-mono">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isActionLoading && setIsConfirmOpen(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Security_Protocol
                </span>
              </div>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 text-center">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${selectedVariant.is_active ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}
              >
                <Power size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2">
                {selectedVariant.is_active ? "Deactivate" : "Activate"}_Unit?
              </h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider leading-relaxed">
                Confirming this action will toggle availability of{" "}
                <span className="text-white font-bold">
                  {selectedVariant.variant_sku}
                </span>
                .
              </p>
            </div>
            <div className="p-6 bg-slate-950/50 flex gap-3">
              <button
                disabled={isActionLoading}
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-3 border border-slate-800 text-slate-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Abort
              </button>
              <button
                disabled={isActionLoading}
                onClick={confirmStatusToggle}
                className={`flex-[2] py-3 text-slate-950 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedVariant.is_active ? "bg-rose-500 hover:bg-rose-400" : "bg-emerald-500 hover:bg-emerald-400"}`}
              >
                {isActionLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}{" "}
                Confirm_Toggle
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddOpen && product && (
        <AddVariantModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          productId={product.id}
          basePrice={product.base_price}
          onUpdate={fetchData}
        />
      )}

      {selectedVariant && product && (
        <EditVariantModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedVariant(null);
          }}
          variant={selectedVariant}
          basePrice={product.base_price}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
