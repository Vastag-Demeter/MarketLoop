"use client";
import { useEffect, useState } from "react";
import api from "@/src/axios";
import { toast } from "sonner";
import { Settings2, Edit3, Power, Activity, Save, Plus, X } from "lucide-react";
import TerminalModal from "@/src/components/add_modal";

interface TicketStatus {
  id: number;
  name: string;
  is_active: boolean;
}

export default function TicketStatusManager() {
  const [statuses, setStatuses] = useState<TicketStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/getAllSupportTicketStatuses");
      setStatuses(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("SYSTEM_ERROR: DATA_FETCH_FAILED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleToggleActive = async (status: TicketStatus) => {
    const promise = api.patch("/api/toggleSupportTicketStatus", {
      id: status.id,
    });

    toast.promise(promise, {
      loading: "CHANGING_STATUS...",
      success: (res) => {
        fetchStatuses();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
  };

  const handleUpdateName = async (id: number) => {
    if (!editName.trim()) return;

    const promise = api.put("/api/updateSupportTicketStatus", {
      id: id,
      name: editName,
    });

    toast.promise(promise, {
      loading: "UPDATING_STATUS...",
      success: (res) => {
        fetchStatuses();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
    setEditingId(null);
  };

  const handleCreateStatus = async (name: string) => {
    setLoading(true);
    const promise = api.post("/api/addSupportTicketStatus", { name: name });

    toast.promise(promise, {
      loading: "ADDING_SUPPORT_TICKET_STATUS...",
      success: (res) => {
        fetchStatuses();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-24 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-l-4 border-cyan-600 pl-6">
          <div>
            <div className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.4em] mb-1">
              System_Configuration // Support_Modules
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Ticket_<span className="text-cyan-500">Statuses</span>
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-white rounded-2xl transition-all group"
            >
              <Plus
                size={20}
                className="text-cyan-500 group-hover:rotate-90 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                New_Status
              </span>
            </button>
          </div>
          <Settings2 className="text-slate-800" size={40} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 text-cyan-500 animate-pulse">
              <Activity size={18} /> INITIALIZING_DATA_STREAM...
            </div>
          ) : (
            statuses.map((status) => (
              <div
                key={status.id}
                className="group bg-slate-900/40 border border-slate-800/60 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between transition-all hover:border-slate-700 shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${status.is_active ? "bg-emerald-500 shadow-emerald-500/50" : "bg-red-500 shadow-red-500/50"}`}
                  />

                  {editingId === status.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-950 border border-cyan-500/50 px-4 py-2 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateName(status.id)}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">
                        Status_Identity
                      </div>
                      <div className="text-lg font-bold text-white tracking-tight italic uppercase">
                        {status.name}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingId(status.id);
                      setEditName(status.name);
                    }}
                    className="p-3 bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => handleToggleActive(status)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      status.is_active
                        ? "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    }`}
                  >
                    <Power size={14} />
                    {status.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <TerminalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateStatus}
          title="Create_Status"
          label="Status_Designation"
          placeholder="ENTER_NEW_STATUS_NAME"
        />

        <div className="mt-12 pt-8 border-t border-slate-900 flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">
          <span>Access_Level: Administrator</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Registry_Sync_Active
          </div>
        </div>
      </div>
    </div>
  );
}
