"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  Send,
  Activity,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

interface Ticket {
  id: number;
  subject: string;
  guest_email: string;
  created_at: Date;
  ticketMessages: TicketMessage[];
}

interface TicketMessage {
  id: number;
  agent: Agent;
  message: string;
  created_at: Date;
}

interface Agent {
  id: number;
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/api/getSupportTicketById/${id}`)
      .then((res) => setTicket(res.data.data))
      .catch((err) => {
        console.error("TICKET_FETCH_ERROR", err);
        toast.error("FAILED_TO_LOAD_TICKET_DATA");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = async () => {
    setLoading(true);
    const promise = api.post("/api/replyToTicket", {
      ticket_id: ticket?.id,
      message: message,
    });

    toast.promise(promise, {
      loading: "REPLYING_TO_TICKET...",
      success: (res) => {
        setMessage("");
        router.push("/helpdesk/tickets");
        return res.data.msg;
      },
      error: (err) => {
        let error;
        if (err.response.data.errors) error = err.response.data.errors[0];
        else error = err.response.data.error;

        return error;
      },
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center text-cyan-500 font-mono">
        <Activity className="animate-spin mb-4" size={32} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-black">
          Accessing_Data_Node...
        </span>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-50 opacity-20" />

      <div className="max-w-4xl mx-auto space-y-8 relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back_To_Registry
          </button>
        </div>

        <div className="bg-slate-900/10 border border-slate-900 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-900/50 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em]">
                <ShieldCheck size={14} /> Encrypted_Communication_Stream
              </div>
              <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">
                {ticket.subject}
              </h1>
              <div className="flex flex-wrap gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Mail size={12} className="text-cyan-500" />{" "}
                  {ticket.guest_email}
                </span>
                <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Clock size={12} className="text-cyan-500" />{" "}
                  {new Date(ticket.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[8px] text-slate-600 font-black uppercase mb-1">
                Ticket_Reference
              </div>
              <div className="text-2xl font-black italic text-slate-800">
                #{ticket.id.toString().padStart(4, "0")}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
              <MessageSquare size={12} /> Data_Payload_Content:
            </div>
            <div className="space-y-6 flex flex-col">
              {ticket.ticketMessages.map((msg, index) => {
                const isAgent = msg.agent !== null;

                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isAgent ? "items-start" : "items-end"} w-full`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl border ${
                        isAgent
                          ? "bg-slate-900/80 border-slate-700 text-slate-200 rounded-tl-none" // Agent stílus (Balra)
                          : "bg-cyan-900/20 border-cyan-500/30 text-cyan-50 rounded-tr-none" // Ügyfél stílus (Jobbra)
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 opacity-50 text-[10px] font-black uppercase tracking-widest">
                        {isAgent ? (
                          <span className="text-cyan-500 underline">
                            Support_Agent
                          </span>
                        ) : (
                          <span>Customer</span>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed italic">
                        {msg.message}
                      </p>

                      {msg.created_at && (
                        <div className="mt-2 text-[8px] text-slate-600 text-right font-bold tabular-nums">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/10 border border-slate-900 rounded-[2.5rem] p-8 space-y-4">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Draft_Outgoing_Response
          </div>
          <textarea
            onChange={(e) => setMessage(e.currentTarget.value)}
            placeholder="INITIALIZE_RESPONSE_PROTOCOL..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-xs text-white placeholder:text-slate-900 focus:outline-none focus:border-cyan-500/50 transition-all min-h-[150px] tracking-widest"
          />
          <button
            onClick={() => handleReply()}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg shadow-cyan-900/10 transition-all"
          >
            <Send size={16} /> Send_Authorization_Response
          </button>
        </div>

        <footer className="pt-6 text-center">
          <p className="text-[8px] text-slate-800 font-black uppercase tracking-[0.4em]">
            Loop_Market // Administrative_Layer // Secure_Node_Access
          </p>
        </footer>
      </div>
    </div>
  );
}
