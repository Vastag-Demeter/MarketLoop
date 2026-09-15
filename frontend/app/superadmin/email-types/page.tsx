"use client";
import { useEffect, useState } from "react";
import api from "@/src/axios";
import { toast } from "sonner";
import { Mail, Edit3, Power, Activity, Save, X, Plus } from "lucide-react";
import TerminalModal from "@/src/components/add_modal";

interface EmailType {
  id: number;
  name: string;
  is_active: boolean;
}

export default function EmailTypeManager() {
  const [emailTypes, setEmailTypes] = useState<EmailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmailTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/getAllEmailTypes");
      setEmailTypes(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("SYSTEM_ERROR: EMAIL_TYPES_FETCH_FAILED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTypes();
  }, []);

  const handleCreateEmailType = async (name: string) => {
    const promise = api.post("/api/addEmailType", { name: name });

    toast.promise(promise, {
      loading: "ADDING_EMAIL_TYPE...",
      success: (res) => {
        fetchEmailTypes();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
  };

  const handleToggleActive = async (type: EmailType) => {
    const promise = api.patch(`/api/toggleEmailType`, {
      id: type.id,
    });

    toast.promise(promise, {
      loading: "UPDATING_EMAIL_TYPE...",
      success: (res) => {
        fetchEmailTypes();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
  };

  const handleUpdateName = async (id: number) => {
    if (!editName.trim()) return;
    const promise = api.put(`/api/updateEmailType`, {
      id: id,
      name: editName,
    });

    toast.promise(promise, {
      loading: "UPDATING_EMAIL_TYPE...",
      success: (res) => {
        fetchEmailTypes();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-24 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-l-4 border-blue-600 pl-6">
          <div>
            <div className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em] mb-1">
              Communication_Core // Template_Management
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Email_<span className="text-blue-500">Types</span>
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-white rounded-2xl transition-all group"
          >
            <Plus
              size={20}
              className="text-blue-500 group-hover:rotate-90 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              New_Protocol
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 text-blue-500 animate-pulse uppercase text-[10px] font-black tracking-widest">
              <Activity size={18} /> Syncing_Email_Registry...
            </div>
          ) : (
            emailTypes.map((type) => (
              <div
                key={type.id}
                className="group bg-slate-900/30 border border-slate-800/60 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between transition-all hover:border-slate-700 shadow-lg"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-2 h-2 rounded-full ${type.is_active ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-700"}`}
                  />

                  {editingId === type.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-950 border border-blue-500/50 px-4 py-2 rounded-xl text-sm text-white focus:outline-none transition-all"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateName(type.id)}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">
                        Protocol_Type
                      </div>
                      <div className="text-lg font-bold text-white tracking-tight italic uppercase flex items-center gap-2">
                        <Mail size={16} className="text-slate-700" />{" "}
                        {type.name}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingId(type.id);
                      setEditName(type.name);
                    }}
                    className="p-3 bg-slate-800/50 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => handleToggleActive(type)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      type.is_active
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white"
                        : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                    }`}
                  >
                    <Power size={14} />
                    {type.is_active ? "Online" : "Offline"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <TerminalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateEmailType}
          title="Add_Email_Protocol"
          label="Protocol_Designation"
          placeholder="ENTER_TYPE_NAME..."
        />

        <div className="mt-12 pt-8 border-t border-slate-900 flex justify-between items-center text-[8px] font-black text-slate-800 uppercase tracking-[0.5em]">
          <span>Module: Communication_Manager</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Static_Connection_Established
          </div>
        </div>
      </div>
    </div>
  );
}
