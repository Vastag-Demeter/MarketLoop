"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Send, ShieldCheck, Activity, User, Cpu } from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

interface Ticket {
  id: number;
  subject: string;
  ticketStatus: TicketStatus;
  ticketMessages: TicketMessage[];
}

interface TicketStatus {
  id: number;
  name: string;
}

interface TicketMessage {
  id: number;
  agent: User;
  message: string;
  created_at: Date;
}

interface User {
  id: number;
}
export default function CustomerTicketPage() {
  const { token } = useParams();
  const [ticket, setTicket] = useState<Ticket>();
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const fetchTicket = async () => {
    try {
      const res = await api.get(`/api/getSupportTicketByToken/${token}`);
      setTicket(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("TICKET_NOT_FOUND_OR_ACCESS_DENIED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [token]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    const promise = api.post(`/api/replyToTicketByCustomer`, {
      token: token,
      message: newMessage,
    });

    toast.promise(promise, {
      loading: "SENDING_TICKET...",
      success: (res) => {
        setNewMessage("");
        fetchTicket();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error || "TRANSMISSION_FAILED";
      },
    });
    setIsSending(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center text-cyan-500 font-mono italic uppercase tracking-widest text-xs animate-pulse">
        Establishing_Secure_Link...
      </div>
    );
  if (!ticket)
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center text-red-500 font-mono uppercase text-xs tracking-widest italic">
        Ticket_Not_Found // Error_404
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12 relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8 relative">
        <header className="border-b border-slate-900 pb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-700 uppercase tracking-[0.4em] mb-2">
              <ShieldCheck size={12} /> Secure_Customer_Access
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Ticket{" "}
              <span className="text-cyan-500">
                #{ticket.id.toString().padStart(4, "0")}
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">
              {ticket.subject}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-slate-700 font-black uppercase">
              Status
            </div>
            <div className="text-[10px] text-cyan-500 font-black uppercase tracking-widest animate-pulse">
              {ticket.ticketStatus.name}
            </div>
          </div>
        </header>

        <div className="space-y-6 min-h-[300px]">
          {ticket.ticketMessages.map((msg: TicketMessage, index: number) => (
            <div
              key={index}
              className={`flex flex-col ${msg.agent ? "items-start" : "items-end"}`}
            >
              <div
                className={`max-w-[85%] p-5 rounded-2xl border ${
                  msg.agent
                    ? "bg-slate-900/40 border-slate-800 text-slate-300 rounded-tl-none"
                    : "bg-cyan-900/10 border-cyan-500/20 text-cyan-100 rounded-tr-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 opacity-50">
                  {msg.agent ? <Cpu size={12} /> : <User size={12} />}
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    {msg.agent ? "Neo-Corp_Support" : "You_Customer"}
                  </span>
                </div>
                <p className="text-xs leading-relaxed italic">{msg.message}</p>
                <div className="mt-3 text-[7px] font-bold text-slate-600 text-right uppercase">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {ticket.ticketStatus.name !== "CLOSED" && (
          <form
            onSubmit={handleReply}
            className="pt-8 border-t border-slate-900 space-y-4"
          >
            <div className="relative group">
              <textarea
                required
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="TYPE_YOUR_RESPONSE_HERE..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-xs text-white placeholder:text-slate-900 focus:outline-none focus:border-cyan-500/50 transition-all min-h-[120px] tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]"
            >
              {isSending ? (
                <Activity className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              Transmit_Response
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
