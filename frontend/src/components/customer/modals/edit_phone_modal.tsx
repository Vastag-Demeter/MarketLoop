"use client";
import { X, Smartphone, Pencil, RefreshCw } from "lucide-react";

interface EditPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    id: number | null;
    phone_number: string;
  };
  setFormData: (data: any) => void;
  onUpdate: () => void;
}

export default function EditPhoneModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onUpdate,
}: EditPhoneModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-mono">
      {/* BACKDROP WITH HEAVY BLUR */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-md bg-[#0a0a0c] border border-cyan-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* TOP DECORATIVE BAR */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="p-8">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase">
                <Pencil size={12} className="animate-pulse" />
                Overwrite_Sequence
              </div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                Edit <span className="text-cyan-500">_Uplink_</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-900 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* INFO CARD */}
          <div className="mb-6 p-4 bg-slate-950 border border-slate-900 rounded-2xl">
            <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">
              Current_Target_Node
            </div>
            <div className="text-xs text-cyan-500 font-bold uppercase tracking-tighter">
              {"//"} ID: {formData.id?.toString().padStart(4, "0")}
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={onUpdate} className="space-y-6">
            {/* PHONE NUMBER INPUT - THE ONLY EDITABLE FIELD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                New_Frequency_Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 group-focus-within:text-cyan-500 transition-colors">
                  <Smartphone size={18} />
                </div>
                <input
                  required
                  type="text"
                  placeholder="+36 30 000 0000"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-bold tracking-wider"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2 flex flex-col gap-3">
              <span
                onClick={onUpdate}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-[0_10px_30px_-10px_rgba(6,182,212,0.4)] active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                Recalibrate_Frequency
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-slate-600 hover:text-slate-400 rounded-2xl font-black uppercase text-[9px] tracking-[0.3em] transition-all"
              >
                Terminate_Edit
              </button>
            </div>
          </form>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
