"use client";
import { useEffect, useState, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Clock,
  Mail,
  ChevronRight,
  Activity,
  Archive,
  AlertCircle,
} from "lucide-react";
import api from "@/src/axios";
import Link from "next/link";
import { toast } from "sonner";

interface Ticket {
  id: number;
  guest_email: string;
  subject: string;
  ticketStatus: TicketStatus;
  ticketMessages: TicketMessage[];
  created_at: Date;
}

interface TicketStatus {
  id: number;
  name: string;
}

interface TicketMessage {
  id: number;
  message: string;
}

export default function HelpdeskAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statuses, setStatuses] = useState<TicketStatus[]>([]); // Státuszok tárolása
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusId, setActiveStatusId] = useState<string>("ALL"); // Aktív szűrő
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketRes, statusRes] = await Promise.all([
        api.get("/api/getSupportTickets"),
        api.get("/api/getSupportTicketStatuses"), // Feltételezve, hogy van ilyen végpontod
      ]);
      setTickets(ticketRes.data.data || []);
      setStatuses(statusRes.data.data || []);
    } catch (err) {
      console.error("DATA_FETCH_ERROR", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusToggle = async (id: number) => {
    const promise = api.patch("/api/toggleSupportTicketStatus", {
      id: id,
    });

    toast.promise(promise, {
      loading: "CHANGING_STATUS...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error || "STATUS_CHANGE_FAILED";
      },
    });
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.guest_email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        activeStatusId === "ALL" ||
        t.ticketStatus.id.toString() === activeStatusId;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, activeStatusId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center text-cyan-500 font-mono">
        <Activity className="animate-spin mb-4" size={32} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-black">
          Decrypting_Tickets...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12 relative overflow-hidden">
      {/* SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-50 opacity-20" />

      <div className="max-w-6xl mx-auto space-y-10 relative">
        {/* HEADER & SEARCH TERMINAL */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-900 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-700 uppercase tracking-[0.4em]">
              Helpdesk_panel // Communications
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
              Support_
              <span className="text-cyan-500 underline decoration-cyan-500/20 underline-offset-8">
                Tickets
              </span>
            </h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyan-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="FILTER_BY_IDENTITY_OR_SUBJECT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/20 border border-slate-800 py-5 pl-14 pr-6 rounded-2xl text-xs text-white placeholder:text-slate-800 focus:outline-none focus:border-cyan-500/50 transition-all uppercase tracking-widest"
            />
          </div>
        </header>

        {/* STATUS FILTER BAR */}
        <div className="flex flex-wrap gap-3 pb-2">
          <button
            onClick={() => setActiveStatusId("ALL")}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
              activeStatusId === "ALL"
                ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600"
            }`}
          >
            [ All_Nodes ]
          </button>
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setActiveStatusId(status.id.toString())}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                activeStatusId === status.id.toString()
                  ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600"
              }`}
            >
              {status.name}
            </button>
          ))}
        </div>

        {/* TICKET FEED */}
        <div className="grid gap-5">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="group relative bg-slate-950 border border-slate-800 hover:border-cyan-500/30 rounded-[2rem] p-6 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                  {/* ICON & ID */}
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all">
                      <MessageSquare size={22} />
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em]">
                        Registry_ID
                      </div>
                      <div className="text-[12px] text-white font-bold tracking-tighter italic">
                        #{ticket.id.toString().padStart(4, "0")}
                      </div>
                    </div>
                  </div>

                  {/* DATA PAYLOAD */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-white uppercase italic tracking-tight truncate group-hover:text-cyan-400 transition-colors">
                        {ticket.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-900/10 border border-cyan-500/20 text-[8px] text-cyan-500 font-black uppercase tracking-widest animate-pulse">
                        {ticket.ticketStatus.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Mail size={12} className="text-slate-700" />{" "}
                        {ticket.guest_email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-700" />{" "}
                        {new Date(ticket.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* MESSAGE PREVIEW */}
                  <div className="hidden lg:block flex-1 max-w-sm border-l border-slate-900 pl-8">
                    <p className="text-[10px] text-slate-600 italic line-clamp-2 leading-relaxed">
                      &quot;
                      {
                        ticket.ticketMessages[ticket.ticketMessages.length - 1]
                          .message
                      }
                      &quot;
                    </p>
                  </div>

                  {/* OPERATOR ACTIONS */}
                  <div className="flex items-center gap-4 ml-auto">
                    <button
                      onClick={() => {
                        handleStatusToggle(ticket.id);
                      }}
                      className={`flex items-center gap-2 px-5 py-3 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        ticket.ticketStatus.name === "CLOSED"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950"
                          : "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-slate-950"
                      }`}
                    >
                      {ticket.ticketStatus.name === "CLOSED" ? (
                        <>
                          <Activity size={14} /> Reopen_Node
                        </>
                      ) : (
                        <>
                          <Archive size={14} /> Close_Session
                        </>
                      )}
                    </button>

                    {ticket.ticketStatus.name !== "CLOSED" &&
                      ticket.ticketStatus.name !== "WAITING_FOR_CUSTOMER" && (
                        <Link
                          href={`/helpdesk/current_ticket/${ticket.id}`}
                          className="p-3 bg-cyan-600 text-slate-950 rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20"
                        >
                          <ChevronRight size={20} />
                        </Link>
                      )}
                  </div>
                </div>

                <div className="absolute top-0 right-0 h-full w-1 bg-cyan-500/0 group-hover:bg-cyan-500 transition-all duration-300" />
              </div>
            ))
          ) : (
            <div className="py-24 border-2 border-dashed border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-slate-700">
              <AlertCircle size={40} className="mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                No_Historical_Requests_Found
              </p>
            </div>
          )}
        </div>

        <footer className="pt-10 border-t border-slate-900 flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            Monitoring_Active: {filteredTickets.length} Entries_Loaded
          </div>
          <div>Secure_Admin_Layer_v2.0</div>
        </footer>
      </div>
    </div>
  );
}
