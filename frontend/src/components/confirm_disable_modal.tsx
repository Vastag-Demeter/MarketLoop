"use client";

interface ConfirmDisableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDisableModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDisableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 transition-all duration-500 font-mono">
      <div className="bg-slate-950 border border-red-950 w-full max-w-lg rounded-xl shadow-[0_0_60px_-10px_rgba(239,68,68,0.2)] relative overflow-hidden group">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>

        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse opacity-60"></div>

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-6 mb-10 pb-6 border-b border-red-950">
            <div className="w-16 h-16 rounded-lg bg-red-950/50 flex items-center justify-center border border-red-900 group-hover:border-red-600 transition-colors shadow-inner">
              <span className="text-red-500 text-3xl font-black group-hover:animate-pulse">
                ⚠
              </span>
            </div>

            <div className="flex-1">
              <div className="text-[10px] text-red-700 uppercase tracking-[0.4em] mb-1">
                SYSTEM_ACCESS_TERMINATION
              </div>
              <h2 className="text-3xl font-black italic uppercase text-white leading-tight tracking-tighter">
                Confirm <span className="text-red-500">Node</span>_Disable?
              </h2>
            </div>
          </div>

          <div className="mb-10 p-6 bg-red-950/20 border-l-4 border-red-600 rounded-r-lg shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-xs text-red-500 font-black">
                WARNING // PROTOCOL
              </div>
              <div className="flex-1 h-px bg-red-900/50"></div>
            </div>
            <p className="text-xs text-red-100/70 leading-relaxed uppercase">
              Executing this action will suspend all user data, secure logs, and
              access permissions. Re-activation requires full identity
              re-verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <button
              onClick={onConfirm}
              className="sm:col-span-3 group/btn relative bg-red-700 hover:bg-red-600 text-white py-5 rounded-lg font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/30 text-xs overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/10 -skew-x-12 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Initiate_Termination</span>
                <span className="text-white/50 group-hover/btn:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </button>

            <button
              onClick={onClose}
              className="sm:col-span-2 bg-slate-900 hover:bg-slate-800 text-slate-400 py-5 rounded-lg font-bold uppercase tracking-widest transition-all border border-slate-800 hover:border-slate-700 text-xs active:scale-95"
            >
              Cancel_Protocol
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-700">
            <div className="flex gap-4">
              <span>STATUS: AWAITING_CONFIRMATION</span>
              <span className="text-red-900/60 font-black tracking-widest group-hover:text-red-700 transition-colors">
                ● PROTOCOL::TERMINATE
              </span>
            </div>
            <div className="animate-pulse">TRACE: ENABLED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
