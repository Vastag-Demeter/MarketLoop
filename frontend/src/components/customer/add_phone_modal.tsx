"use client";
import React from "react";
import { X, Smartphone, Radio } from "lucide-react";

interface PhoneNumber {
  phone_number: string;
}

interface AddPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: PhoneNumber;
  setFormData: (data: PhoneNumber) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function AddPhoneModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
}: AddPhoneModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-mono">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0a0a0c] border border-cyan-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase">
                <Radio size={12} className="animate-pulse" />
                Initialize_Uplink
              </div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                Register <span className="text-cyan-500">_Node_</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-900 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={onSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Frequency_Address (Phone Number)
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

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border border-slate-800 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 transition-all"
              >
                Abort_Action
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-[0_10px_30px_-10px_rgba(6,182,212,0.4)] active:scale-95 flex items-center justify-center gap-2"
              >
                Establish_Link
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-900/50 p-3 text-center">
          <span className="text-[7px] text-slate-600 tracking-[1em] uppercase font-bold">
            Secure_Terminal_Uplink_Authorized
          </span>
        </div>
      </div>
    </div>
  );
}
