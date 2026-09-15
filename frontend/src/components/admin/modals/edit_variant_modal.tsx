"use client";
import { useState, useEffect, useCallback } from "react";
import {
  X,
  Plus,
  Save,
  Zap,
  ChevronRight,
  Box,
  Activity,
  Loader2,
  Power,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

interface AttributeValue {
  id: number;
  value: string;
}

interface Attribute {
  id: number;
  name: string;
  attributeValues: AttributeValue[];
}

interface EditVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: any;
  basePrice: number;
  onUpdate: () => void;
}

export default function EditVariantModal({
  isOpen,
  onClose,
  variant,
  basePrice,
  onUpdate,
}: EditVariantModalProps) {
  const [formData, setFormData] = useState({
    variant_sku: "",
    stock: 0,
    price_modifier: 0,
    is_active: true,
  });

  const [localAttributes, setLocalAttributes] = useState<any[]>([]);
  const [allAvailableAttributes, setAllAvailableAttributes] = useState<
    Attribute[]
  >([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const initializeModal = useCallback(async () => {
    if (!variant) return;

    setFormData({
      variant_sku: variant.variant_sku || "",
      stock: variant.stock || 0,
      price_modifier: Number(variant.price_modifier) || 0,
      is_active: variant.is_active ?? true,
    });

    try {
      const res = await api.get(
        `/api/attributeValuesByVariantId/${variant.id}`,
      );
      const cleanAttributes = res.data.data.map((item: any) => ({
        attribute_name: item.attribute?.name || "Unknown",
        value: item.value || "N/A",
        value_id: item.id,
        is_active: item.pivot?.is_active ?? item.is_active ?? true,
      }));
      setLocalAttributes(cleanAttributes);
    } catch (err) {
      console.error("MODAL_ATTR_FETCH_ERROR", err);
    }
  }, [variant]);

  useEffect(() => {
    if (isOpen) {
      initializeModal();
      fetchGlobalAttributes();
    }
  }, [isOpen, initializeModal]);

  const fetchGlobalAttributes = async () => {
    try {
      const res = await api.get("/api/getAttributes");
      setAllAvailableAttributes(res.data.data || []);
    } catch (err) {
      console.error("ATTR_FETCH_ERROR", err);
    }
  };

  const handleAttachAttribute = async (
    attrName: string,
    valueObj: AttributeValue,
  ) => {
    if (localAttributes.some((a) => a.value_id === valueObj.id)) {
      toast.error(`Registry_Conflict: Component already present`);
      return;
    }

    setIsActionLoading(true);
    try {
      await api.post("/api/addAttributeVariant", {
        variant_id: variant.id,
        attribute_value_id: valueObj.id,
      });

      setLocalAttributes((prev) => [
        ...prev,
        {
          attribute_name: attrName,
          value: valueObj.value,
          value_id: valueObj.id,
          is_active: true,
        },
      ]);

      toast.success(`${attrName}_Integrated`);
      setIsPickerOpen(false);
      onUpdate();
    } catch (err) {
      toast.error("Integration_Failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleAttributeStatus = async (attr: any) => {
    setIsActionLoading(true);
    try {
      await api.put("/api/changeAttributeVariantActiveness", {
        variant_id: variant.id,
        attribute_value_id: attr.value_id,
      });

      setLocalAttributes((prev) =>
        prev.map((item) =>
          item.value_id === attr.value_id
            ? { ...item, is_active: !item.is_active }
            : item,
        ),
      );

      toast.success(`Module_Status_Synchronized`);
      onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Status_Update_Failure");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCommitUpdate = async () => {
    setIsSubmitting(true);
    try {
      await api.put("/api/updateProductVariant", {
        id: variant.id,
        price_modifier: formData.price_modifier,
        variant_sku: formData.variant_sku,
        stock: formData.stock,
      });
      toast.success("CORE_REGISTRY_SYNCED");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.log(err.response?.data?.errors);
      toast.error(err.response?.data?.error || "UPDATE_FAILURE");
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
      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-cyan-500 animate-pulse" />
              <span className="text-[10px] text-cyan-500/50 font-black uppercase tracking-[0.4em]">
                Hardware_Modification_Unit
              </span>
            </div>
            <h2 className="text-xl font-black uppercase italic">
              Edit_Variant{" "}
              <span className="text-cyan-500">_{variant?.variant_sku}_</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 uppercase font-black ml-1">
                Registry_SKU
              </label>
              <div className="relative">
                <Box
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  type="text"
                  value={formData.variant_sku}
                  onChange={(e) =>
                    setFormData({ ...formData, variant_sku: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-cyan-500 outline-none uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 uppercase font-black ml-1">
                Stock_Integrity
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-8 group">
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
                className="w-full bg-slate-900 border border-cyan-500/20 rounded-2xl py-4 px-6 text-xl font-black text-cyan-400 focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-center border-l border-slate-800 md:pl-8">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                Final_Value
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black italic text-white">
                  ${finalPrice}
                </span>
                <span className="text-xs text-slate-600 line-through">
                  ${basePrice}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 min-h-[200px] relative">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                Hardware_Parameters
              </h3>
              <button
                disabled={isActionLoading}
                onClick={() => setIsPickerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-500 hover:text-slate-950 text-[10px] font-black rounded-xl transition-all border border-cyan-500/20 disabled:opacity-50"
              >
                {isActionLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}{" "}
                Attach_Component
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {localAttributes.map((attr, index) => (
                <div
                  key={index}
                  className={`flex gap-4 items-center p-4 rounded-2xl border transition-all ${attr.is_active ? "bg-slate-950/50 border-slate-800" : "bg-slate-900/20 border-slate-900 opacity-40 grayscale"}`}
                >
                  <div className="flex-1">
                    <span className="text-[8px] text-slate-600 font-black block uppercase mb-1">
                      Layer_Type
                    </span>
                    <span className="text-[11px] font-black text-white uppercase">
                      {attr.attribute_name}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-800" />
                  <div className="flex-1">
                    <span className="text-[8px] text-cyan-500/40 font-black block uppercase mb-1">
                      Assigned_Spec
                    </span>
                    <span
                      className={`text-[11px] font-black italic uppercase ${attr.is_active ? "text-cyan-400" : "text-slate-600"}`}
                    >
                      {attr.value}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleAttributeStatus(attr)}
                    className={`p-2 rounded-xl transition-all ${attr.is_active ? "text-cyan-500 hover:bg-cyan-500/10" : "text-slate-500 hover:bg-slate-800"}`}
                  >
                    <Power
                      size={16}
                      className={attr.is_active ? "animate-pulse" : ""}
                    />
                  </button>
                </div>
              ))}
            </div>

            {isPickerOpen && (
              <div className="absolute inset-0 z-50 bg-slate-900 border border-cyan-500/30 rounded-[2rem] flex flex-col animate-in fade-in zoom-in duration-300">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 rounded-t-[2rem]">
                  <span className="text-[10px] font-black text-cyan-500 uppercase">
                    System_Attribute_Registry
                  </span>
                  <button
                    onClick={() => setIsPickerOpen(false)}
                    className="text-slate-500 hover:text-white p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 h-full custom-scrollbar">
                  {allAvailableAttributes.map((attr) => (
                    <div key={attr.id} className="space-y-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                        {attr.name}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {attr.attributeValues?.map((val) => (
                          <button
                            key={val.id}
                            onClick={() =>
                              handleAttachAttribute(attr.name, val)
                            }
                            className="text-left p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all group"
                          >
                            <span className="text-[9px] font-black text-slate-500 group-hover:text-cyan-400 uppercase truncate block">
                              {val.value}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800/50 flex gap-4 bg-slate-900/50">
          <button
            onClick={onClose}
            className="flex-1 py-4 border border-slate-800 text-slate-500 text-[10px] font-black rounded-2xl uppercase hover:bg-slate-800"
          >
            Close
          </button>
          <button
            disabled={isSubmitting || isActionLoading}
            onClick={handleCommitUpdate}
            className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-[10px] font-black rounded-2xl uppercase transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}{" "}
            Commit_Hardware_Sync
          </button>
        </div>
      </div>
    </div>
  );
}
