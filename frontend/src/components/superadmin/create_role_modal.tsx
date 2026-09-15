"use client";
import React, { useState } from "react";
import { X, ShieldPlus, Terminal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/axios";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.error("PROTOCOL_ERROR: Name_Required");
      return;
    }

    setIsSubmitting(true);

    const promise = api.post("/api/addRole", {
      name: roleName.toUpperCase().trim(),
    });

    toast.promise(promise, {
      loading: "INITIALIZING_NEW_PROTOCOL...",
      success: (res) => {
        setRoleName("");
        onSuccess();
        onClose();
        return res.data.msg || "New_Role_Injected_Successfully";
      },
      error: (err) => {
        console.log(err.response?.data?.errors);
        return err.response?.data?.error || "Critical_Auth_Failure";
      },
    });

    try {
      await promise;
    } catch (err) {
      console.error("CREATE_ROLE_ERROR", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] text-cyan-500/50 font-black uppercase tracking-[0.4em]">
                System_Registry
              </span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                New <span className="text-cyan-500">_PROTOCOL_</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-4">
                Clearance_Identity
              </label>
              <div className="relative">
                <Terminal
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50"
                />
                <input
                  id="CreateModal.input"
                  autoFocus
                  type="text"
                  placeholder="e.g. CORE_OPERATIVE"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-cyan-50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-800 tracking-widest uppercase"
                />
              </div>
            </div>

            <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
              <p className="text-[9px] text-cyan-500/60 leading-relaxed font-bold uppercase italic">
                Notice: New clearance protocols will be immediately visible
                across the Global_User_Registry for assignment.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                id="CreateModal.close"
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Abort
              </button>
              <button
                id="CreateModal.submit"
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] flex items-center justify-center gap-3 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <ShieldPlus size={16} />
                    Execute_Initialization
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
