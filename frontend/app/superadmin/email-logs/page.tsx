"use client";
import { useEffect, useState } from "react";
import api from "@/src/axios";
import { toast } from "sonner";
import { Search, Clock, Mail, ChevronRight, Activity } from "lucide-react";
import EmailDetailsModal from "@/src/components/superadmin/email_log_detail";

export default function EmailLogAudit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/getEmailLogs");
      setLogs(res.data.data);
    } catch (err) {
      toast.error("AUDIT_FAILURE: CANNOT_RETRIEVE_LOGS");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (id: number) => {
    setDetailsLoading(true);
    try {
      const res = await api.get(`/api/getEmailLogById/${id}`);
      setSelectedLog(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("DETAILED_VIEW_ERROR: ACCESS_DENIED");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 pt-24 font-mono relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-4 border-cyan-600 pl-6">
          <div>
            <div className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.4em] mb-1">
              Communication_Audit // Central_Logs
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Email_<span className="text-cyan-500">Archives</span>
            </h1>
          </div>

          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              size={16}
            />
            <input
              type="text"
              placeholder="SEARCH_BY_RECIPIENT..."
              className="w-full bg-slate-900/50 border border-slate-800 py-3 pl-12 pr-4 rounded-xl text-xs focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 relative">
          {loading || detailsLoading ? (
            <div className="flex items-center gap-3 text-cyan-500 animate-pulse uppercase text-[10px] font-black tracking-[0.3em]">
              <Activity size={18} /> Accessing_Secure_Data_Stream...
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => handleOpenDetails(log.id)}
                className="group bg-slate-900/20 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:border-cyan-500/30 hover:bg-slate-900/40"
              >
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-slate-950 rounded-xl text-slate-700 group-hover:text-cyan-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                      {log.recipient_email}
                    </div>
                    <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black">
                      {log.subject.substring(0, 60)}...
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 justify-end font-black">
                      <Clock size={12} className="text-slate-600" />
                      {new Date(log.sent_at).toLocaleDateString()}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-800 group-hover:text-cyan-500 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <EmailDetailsModal
          log={selectedLog}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
