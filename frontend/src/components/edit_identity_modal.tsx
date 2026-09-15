"use client";

interface EditIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { firstName: string; lastName: string };
  setFormData: (data: { firstName: string; lastName: string }) => void;
  onSave: () => void;
}

export default function EditIdentityModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
}: EditIdentityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-mono animate-in fade-in duration-300">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <path
              d="M0 0 L100 0 L100 100 Z"
              fill="currentColor"
              className="text-cyan-500"
            />
          </svg>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-cyan-600 font-black uppercase tracking-[0.3em]">
                Identity_Kernel_Update
              </span>
            </div>
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">
              Modify <span className="text-cyan-500">_User_Node_</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-[9px] text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Data_Field // First_Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all"
                  placeholder="Enter_First_Name..."
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-700 rounded-full group-focus-within:bg-cyan-500 transition-colors"></div>
              </div>
            </div>

            <div className="relative group">
              <label className="block text-[9px] text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Data_Field // Last_Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all"
                  placeholder="Enter_Last_Name..."
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-700 rounded-full group-focus-within:bg-cyan-500 transition-colors"></div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={onSave}
              className="w-full relative group/btn overflow-hidden bg-cyan-600 text-white py-3.5 rounded-lg font-black uppercase tracking-widest text-[11px] transition-all hover:bg-cyan-500 active:scale-[0.98] shadow-lg shadow-cyan-900/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Commit_Changes_To_Node
                <span className="opacity-50 group-hover/btn:translate-x-1 transition-transform">
                  »
                </span>
              </span>

              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg font-bold text-slate-500 uppercase tracking-widest text-[10px] hover:text-slate-300 hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
            >
              Abort_Operation
            </button>
          </div>

          <div className="mt-6 flex justify-between items-center text-[8px] text-slate-700 border-t border-slate-900 pt-4 font-mono">
            <span>SECURE_ENCRYPTION_ACTIVE</span>
            <span className="tracking-widest">LAYER_02_AUTH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
