"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import api from "@/src/axios";
import { useRouter } from "next/navigation";
import AddressCard from "@/src/components/customer/address_card";
import AddAddressModal from "@/src/components/customer/modals/add_address_modal";
import { toast } from "sonner";
import EditAddressModal from "@/src/components/customer/modals/edit_address_modal";

interface Address {
  id: number | null;
  country: Country;
  city: City;
  postal_code: string;
  street: Street;
  house_number: string;
  floor?: string;
  door?: string;
}

interface Street {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  postal_code: string;
}

export default function AddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Address>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    country: "",
    city: "",
    postal_code: "",
    street: "",
    house_number: "",
    floor: "",
    door: "",
  });

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/api/getAddress");
      setAddresses(response.data.data || []);
    } catch (error: any) {
      setError("Error_Syncing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [router]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const promise = api.post("/api/addAddress", formData);

    toast.promise(promise, {
      loading: "INITIALIZING_DATALINK_TRANSFER...",
      success: (response) => {
        setFormData({
          country: "",
          city: "",
          postal_code: "",
          street: "",
          house_number: "",
          floor: "",
          door: "",
        });
        setIsModalOpen(false);
        fetchAddresses();
        return response.data.msg || `NODE_REGISTRY_SUCCESS`;
      },
      error: (err) => {
        const msg = err.response?.data?.error || "REGISTRY_ENTRY_FAILED";
        return `CRITICAL_ERROR: ${msg}`;
      },
    });
  };

  const handleDeleteAddress = async (id: number) => {
    console.log("Delete: ", id);

    const promise = api.delete("/api/deleteAddress", { data: { id: id } });

    toast.promise(promise, {
      loading: "DELETING_ADDRESS...",
      success: (response) => {
        fetchAddresses();
        return response.data.msg || "NODE_DELETION_SUCCESS";
      },
      error: (err) => {
        const msg = err.response?.data?.error || "NODE_DELETION_FAILED";
        return `CRITICAL_ERROR: ${msg}`;
      },
    });
  };

  const handleEditClick = (addr: Address) => {
    setEditFormData({
      id: addr.id,
      country: addr.country,
      city: addr.city,
      postal_code: addr.city.postal_code || addr.postal_code,
      street: addr.street,
      house_number: addr.house_number,
      floor: addr.floor || "",
      door: addr.door || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const promise = api.put("/api/updateAddress", editFormData);

    toast.promise(promise, {
      loading: "RECALIBRATING_NODE_COORDINATES...",
      success: () => {
        setIsEditModalOpen(false);
        fetchAddresses();
        return `NODE_UPDATE_COMPLETE`;
      },
      error: (err) => {
        const msg = err.response?.data?.error || "UPDATE_SEQUENCE_INTERRUPTED";
        return `CRITICAL_ERROR: ${msg}`;
      },
    });
  };
  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono">
        <Loader2 className="text-cyan-500 animate-spin mb-4" size={40} />
        <div className="text-[10px] text-cyan-500 tracking-[0.5em] uppercase font-black">
          Syncing_Data_Stream...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-mono flex flex-col items-center text-sm">
      <div className="w-full max-w-5xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-2 text-[10px] text-cyan-500 tracking-[0.5em] font-black uppercase">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            Logistics_Registry_v4.1
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            Delivery <span className="text-cyan-500">_Nodes_</span>
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] uppercase tracking-widest text-center italic">
            [!] Alert: {error}
          </div>
        )}

        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.4)] active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            Initialize_New_Node
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onDelete={handleDeleteAddress}
              onEdit={() => handleEditClick(addr)}
            />
          ))}
        </div>
      </div>
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddAddress}
      />
      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        formData={editFormData}
        setFormData={setEditFormData}
        onUpdate={handleUpdateAddress}
      />
    </div>
  );
}
