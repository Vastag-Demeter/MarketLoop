"use client";
import React, { useState } from "react";
import { Send, Mail, MessageSquare, Tag, Loader2 } from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

export default function HelpdeskPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    guest_email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const promise = api.post("/api/createSupportTicket", formData);

    toast.promise(promise, {
      loading: "SUBMITTING_TICKET...",
      success: (res) => {
        setFormData({
          guest_email: "",
          subject: "",
          message: "",
        });
        return res.data.msg;
      },
      error: (err) => {
        let error = "ERROR";
        if (err.response.data.errors) error = err.response.data.errors[0];
        else error = err.response.data.error;

        return error;
      },
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans py-20 px-6">
      <div className="max-w-xl mx-auto">
        {/* Egyszerű Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">CONTACT</h1>
          <p className="text-slate-400 text-sm">
            Contact us and we will reply as soon as possible
          </p>
        </div>

        {/* Letisztult Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 ml-1">
              E-mail
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                required
                type="email"
                placeholder="example@email.com"
                value={formData.guest_email}
                onChange={(e) =>
                  setFormData({ ...formData, guest_email: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Tárgy */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 ml-1">
              Subject
            </label>
            <div className="relative">
              <Tag
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                required
                type="text"
                placeholder="What can we help you with?"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Üzenet */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 ml-1">
              Üzenet
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute left-4 top-4 text-slate-500"
                size={18}
              />
              <textarea
                required
                rows={5}
                placeholder="Give us the details..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Küldés gomb - Sima kék */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={18} />
            )}
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
