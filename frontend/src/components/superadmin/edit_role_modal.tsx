"use client";
import React, { useState, useEffect } from "react";
import { X, Terminal, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/axios";
import { Role } from "@/src/interfaces/user";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

export default function EditRoleModal({
  isOpen,
  onClose,
  onSuccess,
  role,
}: EditRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
    }
  }, [role, isOpen]);

  if (!isOpen || !role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim() || roleName === role.name) {
      onClose();
      return;
    }

    setIsSubmitting(true);

    const promise = api.put("/api/updateRole", {
      id: role.id,
      name: roleName.toUpperCase().trim(),
    });

    toast.promise(promise, {
      loading: "RECALIBRATING_PROTOCOL_IDENTITY...",
      success: (res) => {
        onSuccess();
        onClose();
        return res.data.msg || "Protocol_Identity_Updated";
      },
      error: (err) => err.response?.data?.error || "Update_Override_Failed",
    });

    try {
      await promise;
    } catch (err) {
      console.error("EDIT_ROLE_ERROR", err);
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

      <div className="relative bg-slate-900 border border-indigo-500/30 w-full max-w-md rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] text-indigo-400/50 font-black uppercase tracking-[0.4em]">
                Protocol_Adjustment
              </span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                Edit <span className="text-indigo-400">_CLEARANCE_</span>
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
                Current_Identity:{" "}
                <span className="text-indigo-500">{role.name}</span>
              </label>
              <div className="relative">
                <Terminal
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/50"
                />
                <input
                  id="RoleEdit.input"
                  autoFocus
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-indigo-50 focus:border-indigo-500 outline-none transition-all tracking-widest uppercase"
                />
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <p className="text-[9px] text-indigo-400/60 leading-relaxed font-bold uppercase italic text-center">
                Attention: Altering protocol identity will affect all assigned
                system operatives immediately.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                id="RoleEdit.cancel"
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Abort
              </button>
              <button
                id="RoleEdit.submit"
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Save size={16} />
                    Commit_Changes
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
