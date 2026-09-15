"use client";
import { X, AlertTriangle, Loader2, DatabaseZap, Power } from "lucide-react";
import { Role } from "@/src/interfaces/user";

interface StatusToggleProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: Role | null;
  isSubmitting?: boolean;
}

export default function StatusToggleModal({
  isOpen,
  onClose,
  onConfirm,
  role,
  isSubmitting = false,
}: StatusToggleProps) {
  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 font-mono">
      <div
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border-2 border-rose-900 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_60px_-10px_rgba(225,29,72,0.3)] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-600 animate-pulse" />

        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500">
                <AlertTriangle size={28} />
              </div>
              <div>
                <span className="text-[10px] text-rose-500/70 font-black uppercase tracking-[0.4em]">
                  CRITICAL_PROTOCOL_CHANGE
                </span>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                  Confirm <span className="text-rose-500">_CHANGE_</span>
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
              <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
                Are you sure you want to change the activeness on the role:
              </p>
              <div className="mt-4 px-4 py-3 bg-rose-500/5 border border-rose-500/20 rounded-lg inline-block">
                <span className="text-xl font-black text-rose-400 uppercase tracking-widest italic">
                  {role.name}
                </span>
              </div>
            </div>

            <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-4 items-center">
              <DatabaseZap size={32} className="text-rose-600 flex-shrink-0" />
              You can always reverse this change.
            </div>

            <div className="flex gap-4 pt-6">
              <button
                id="RoleStatusConfirm.cancel"
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all"
              >
                Abort_Operation
              </button>
              <button
                type="button"
                id="RoleStatusConfirm.submit"
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-[1.5] flex items-center justify-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Power size={18} className="group-hover:animate-pulse" />
                    Execute_System_Change
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
