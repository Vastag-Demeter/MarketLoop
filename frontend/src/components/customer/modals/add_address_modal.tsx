"use client";
import React from "react";
import { X } from "lucide-react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function AddAddressModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
}: AddAddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(6,182,212,0.15)] relative">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              New <span className="text-cyan-500">_Registry_</span>
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={onSave} className="space-y-5 text-left">
            <div>
              <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                Region_Country
              </label>
              <input
                required
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold italic"
                placeholder="Magyarország"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                  Zip
                </label>
                <input
                  required
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold italic"
                  placeholder="1117"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                  City
                </label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold italic"
                  placeholder="Budapest"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                  Street
                </label>
                <input
                  required
                  type="text"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold italic"
                  placeholder="Budafoki út"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                  No.
                </label>
                <input
                  required
                  type="text"
                  value={formData.house_number}
                  onChange={(e) =>
                    setFormData({ ...formData, house_number: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold italic"
                  placeholder="56"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 opacity-70">
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1 italic">
                  Floor_(Opt)
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  className="w-full bg-slate-950/30 border border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/30 transition-all font-bold"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1 italic">
                  Door_(Opt)
                </label>
                <input
                  type="text"
                  value={formData.door}
                  onChange={(e) =>
                    setFormData({ ...formData, door: e.target.value })
                  }
                  className="w-full bg-slate-950/30 border border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/30 transition-all font-bold"
                  placeholder="12"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[0_10px_30px_-10px_rgba(6,182,212,0.4)]"
            >
              Confirm_Registry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
