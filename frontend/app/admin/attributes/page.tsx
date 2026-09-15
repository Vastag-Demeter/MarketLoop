"use client";
import { useEffect, useState, useMemo } from "react";
import api from "@/src/axios";
import { toast } from "sonner";
import {
  Plus,
  Power,
  Edit3,
  Database,
  Activity,
  RefreshCcw,
  Search,
} from "lucide-react";
import TerminalModal from "@/src/components/add_modal";

interface Attribute {
  id: number;
  is_active: boolean;
  name: string;
  values: AttributeValues[];
}
interface AttributeValues {
  id: number;
  value: string;
  is_active: boolean;
}
export default function AttributeManager() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [isAddAttributeModalOpen, setIsAddAttributeModalOpen] = useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] =
    useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null,
  );
  const [isAddAttrValueModalOpen, setisAddAttrValueModalOpen] = useState(false);
  const [isEditValueModalOpen, setIsEditValueModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<AttributeValues>();
  const fetchData = async () => {
    try {
      const attrRes = await api.get("/api/getAllAttributes");
      const baseAttributes = attrRes.data.data;

      const fullData = await Promise.all(
        baseAttributes.map(async (attr: Attribute) => {
          try {
            const valRes = await api.get(
              `/api/getAllAttributeValues/${attr.id}`,
            );
            return { ...attr, values: valRes.data.data || [] };
          } catch (e) {
            console.error(e);
            return { ...attr, values: [] };
          }
        }),
      );

      setAttributes(fullData);
    } catch (err) {
      console.error(err);
      toast.error("CRITICAL_DATABASE_SYNC_ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeSelectedAttribute = (attr: Attribute) => {
    setSelectedAttribute(attr);
  };

  const filteredAttributes = useMemo(() => {
    return attributes.filter((attr) => {
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
            ? attr.is_active === true
            : attr.is_active === false;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        attr.name.toLowerCase().includes(searchLower) ||
        attr.values.some((v: AttributeValues) =>
          v.value.toLowerCase().includes(searchLower),
        );

      return matchesStatus && matchesSearch;
    });
  }, [attributes, searchTerm, statusFilter]);

  const onAddAttribute = async (name: string) => {
    if (!name) return;

    const promise = api.post("/api/addAttribute", { name: name });

    toast.promise(promise, {
      loading: "ADDING_ATTRIBUTE...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });

    setIsAddAttributeModalOpen(false);
  };

  const onUpdateAttribute = async (name: string) => {
    if (!name || name === selectedAttribute?.name) return;

    const promise = api.put("/api/updateAttribute", {
      id: selectedAttribute?.id,
      name,
    });

    toast.promise(promise, {
      loading: "UPDATING_ATTRIBUTE...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
  };

  const onToggleAttribute = async (id: number) => {
    const promise = api.put("/api/changeAttributeActiveness", { id });

    toast.promise(promise, {
      loading: "CHANGING_ATTRIBUTE_ACTIVENESS...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
  };

  const onAddValue = async (name: string) => {
    if (!name) return;
    try {
      await api.post("/api/addAttributeValue", {
        attribute_id: selectedAttribute?.id,
        value: name,
      });
      toast.success("VALUE_COMMITTED");
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error("VALUE_WRITE_ERROR");
    }
  };

  const onUpdateValue = async (name: string) => {
    if (!name || name === selectedValue?.value) return;

    const promise = api.put("/api/updateAttributeValue", {
      id: selectedValue?.id,
      value: name,
    });

    toast.promise(promise, {
      loading: "UPDATING_ATTRIBUTE_VALUE...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.errors[0];
      },
    });
  };

  const onToggleValue = async (id: number) => {
    const promise = api.put("/api/changeAttributeValueActiveness", { id });

    toast.promise(promise, {
      loading: "ADDING_ATTRIBUTE_VALUE...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.errors[0];
      },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-cyan-500 animate-pulse uppercase tracking-[0.5em]">
        <RefreshCcw size={40} className="mb-4 animate-spin" />
        Decrypting_Registry_Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-900 pb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-500/50 mb-2">
              <Database size={14} />
              <span className="text-[10px] uppercase tracking-[0.4em]">
                Hardware_Schema_Core
              </span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Attribute_<span className="text-cyan-500">Registry</span>
            </h1>
          </div>

          <button
            onClick={() => setIsAddAttributeModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-cyan-500 text-slate-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Plus size={14} /> Initialize_Attribute
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-2 relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="SEARCH_BY_NAME_OR_VALUE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="flex bg-slate-900/40 border border-slate-800 rounded-xl p-1 gap-1">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${
                  statusFilter === s
                    ? "bg-slate-800 text-cyan-400 shadow-inner"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAttributes.length > 0 ? (
            filteredAttributes.map((attr) => (
              <div
                key={attr.id}
                className={`group border transition-all duration-300 rounded-2xl p-1 ${
                  attr.is_active
                    ? "bg-slate-900/20 border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20"
                    : "bg-slate-950 border-rose-900/10 opacity-60"
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="w-full md:w-64 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${attr.is_active ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-slate-700"}`}
                      />
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                        ID_{attr.id}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-white uppercase mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                      {attr.name}
                    </h2>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          changeSelectedAttribute(attr);
                          setIsEditAttributeModalOpen(true);
                        }}
                        className="flex-1 flex justify-center py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-white hover:border-slate-600 transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onToggleAttribute(attr.id)}
                        className={`flex-1 flex justify-center py-2 rounded-lg border transition-all ${
                          attr.is_active
                            ? "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                            : "border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                        }`}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 w-full bg-black/40 rounded-xl p-4 border border-slate-900/50 flex flex-wrap gap-2 items-center">
                    {attr.values.length > 0 ? (
                      attr.values.map((v: AttributeValues) => (
                        <div
                          key={v.id}
                          className={`group/val flex items-center gap-3 px-4 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                            v.is_active
                              ? "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-cyan-500"
                              : "bg-transparent border-rose-900/10 text-rose-900"
                          }`}
                        >
                          <span>{v.value}</span>
                          <div className="flex gap-2 border-l border-slate-800 pl-2 ml-1">
                            <button
                              onClick={() => {
                                setSelectedValue(v);
                                setIsEditValueModalOpen(true);
                              }}
                              className="text-slate-600 hover:text-cyan-400 transition-colors"
                            >
                              <Edit3 size={10} />
                            </button>
                            <button
                              onClick={() => onToggleValue(v.id)}
                              className="text-slate-600 hover:text-rose-500 transition-colors"
                            >
                              <Activity size={10} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-[9px] text-slate-800 uppercase italic pl-2">
                        No_values_detected
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedAttribute(attr);
                        setisAddAttrValueModalOpen(true);
                      }}
                      className="ml-2 p-2 rounded-lg border border-dashed border-slate-800 text-slate-600 hover:text-cyan-500 hover:border-cyan-500 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl">
              <p className="text-slate-600 text-[10px] uppercase tracking-widest font-black">
                No_Matching_Hardware_Nodes_Found
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 text-cyan-500 text-[9px] hover:underline uppercase"
              >
                [Reset_Filters]
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex justify-between items-center opacity-30 text-[8px] uppercase tracking-[0.3em]">
          <p>Auth_Level: Administrator</p>
          <p>
            Filtered_Nodes: {filteredAttributes.length} / {attributes.length}
          </p>
        </div>
      </div>

      <TerminalModal
        isOpen={isAddAttributeModalOpen}
        onClose={() => setIsAddAttributeModalOpen(false)}
        title="ADD_ATTRIBUTE"
        label="Add new attribute"
        placeholder="ATTRIBUTE_NAME"
        onSave={onAddAttribute}
      />
      <TerminalModal
        isOpen={isEditAttributeModalOpen}
        onClose={() => setIsEditAttributeModalOpen(false)}
        title="UPDATE_ATTRIBUTE"
        label="Update existing attribute"
        placeholder={selectedAttribute?.name}
        onSave={onUpdateAttribute}
      />
      <TerminalModal
        onClose={() => setisAddAttrValueModalOpen(false)}
        isOpen={isAddAttrValueModalOpen}
        title="ADD_ATTRIBUTE_VALUE"
        label="Add new value to attribute."
        placeholder="NAME"
        onSave={onAddValue}
      />
      <TerminalModal
        onClose={() => setIsEditValueModalOpen(false)}
        isOpen={isEditValueModalOpen}
        title="UPDATE_ATTRIBUTE_VALUE"
        placeholder={selectedValue?.value}
        onSave={onUpdateValue}
        label="Update existing attribute value."
      />
    </div>
  );
}
