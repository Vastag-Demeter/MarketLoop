"use client";
import { useState, useEffect } from "react";
import api from "@/src/axios";
import { Product } from "@/src/interfaces/product";
import { Image as ProductImage } from "@/src/interfaces/product";
import { toast } from "sonner";
import Image from "next/image";
export default function ProductImagePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/api/getActiveProducts/`);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setProducts(data || []);
      } catch (err) {
        console.error("Hiba a termékek betöltésekor", err);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    if (selectedProduct?.images) {
      const nextOrder = selectedProduct.images.length + 1;
      setSortOrder(nextOrder);
    }
  }, [selectedProduct]);

  const fetchProductImages = async (productID: number) => {
    try {
      const res = await api.get(`/api/getProductImages/${Number(productID)}`);
      setCurrentImages(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePicture = async (productID: number, id: number) => {
    const promise = api.delete(`/api/deleteProductImage/${Number(id)}`);
    toast.promise(promise, {
      loading: "DELETING_IMAGE...",
      success: (res) => {
        fetchProductImages(productID);
        return res.data.msg;
      },
      error: (error) => {
        console.error(error);
        return "IMAGE_DELETION_FAILED";
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProduct) return;

    const uploadProcess = async () => {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "Thesis");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/dkqzv5npa/image/upload`,
        { method: "POST", body: formData },
      );

      if (!cloudRes.ok) throw new Error("CLOUDINARY_UPLOAD_FAILED");
      const cloudData = await cloudRes.json();

      const apiRes = await api.post("/api/addProductImage", {
        product_id: parseInt(String(selectedProduct.id)),
        url: cloudData.secure_url,
        sort_order: sortOrder,
      });

      setPreviewUrl(null);
      setSelectedFile(null);
      fetchProductImages(selectedProduct.id);

      return apiRes.data;
    };

    toast.promise(uploadProcess(), {
      loading: "INJECTING_VISUAL_ASSET...",
      success: () => {
        fetchProductImages(selectedProduct.id);
        setUploading(false);
        return "SUCCESS: Visual registry updated.";
      },
      error: (err) => {
        console.log(err.response.data.error);
        setUploading(false);
        return "SYSTEM_FAILURE: Upload or Database sync failed.";
      },
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-mono pt-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-slate-900/20 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-xl h-[800px] flex flex-col">
          <h3 className="text-[10px] text-cyan-500 mb-4 tracking-[0.3em] uppercase font-black">
            Database_Registry
          </h3>
          <input
            type="text"
            placeholder="Search_SKU_or_Name..."
            className="w-full bg-slate-950/50 border border-slate-800 p-3 mb-6 rounded-xl text-xs outline-none focus:border-cyan-500/50 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  fetchProductImages(p.id);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all group ${
                  selectedProduct?.id === p.id
                    ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="relative w-10 h-10 bg-slate-950 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0].url}
                      alt="Product image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    />
                  )}
                </div>
                <div className="text-left overflow-hidden text-ellipsis whitespace-nowrap">
                  <div
                    className={`text-[11px] font-bold uppercase ${selectedProduct?.id === p.id ? "text-cyan-400" : "text-slate-300"}`}
                  >
                    {p.name}
                  </div>
                  <div className="text-[9px] text-slate-500">{p.sku}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {selectedProduct ? (
            <>
              <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter">
                    Visual_Assets:{" "}
                    <span className="text-cyan-500">
                      {selectedProduct.name}
                    </span>
                  </h2>
                  <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 uppercase">
                    Count: {currentImages.length || 0}
                  </span>
                </div>

                {currentImages && currentImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentImages.map((img: ProductImage) => (
                      <div
                        key={img.id}
                        className="relative group aspect-square bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden"
                      >
                        <Image
                          src={img.url}
                          alt="Product Image"
                          fill
                          sizes="100px"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all"
                        />

                        <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[8px] font-bold text-cyan-500 border border-cyan-500/30">
                          ORDER_{img.sort_order}
                        </div>
                        <button
                          onClick={() => {
                            handleDeletePicture(selectedProduct.id, img.id);
                          }}
                          className="absolute top-2 right-2 p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-rose-500/50"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 text-[10px] uppercase tracking-widest">
                    No_visual_data_found_in_registry
                  </div>
                )}
              </div>

              <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-black uppercase text-white mb-4 tracking-widest">
                    Upload_New_Visual
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] text-slate-500 uppercase mb-2">
                        Priority_Sequence
                      </label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div className="relative aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden group">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Product Image"
                          fill
                          sizes="100px"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-2xl opacity-30">📸</span>
                          <p className="text-[8px] text-slate-600 uppercase mt-2">
                            Drop_Visual_Here
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-3">
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 mb-auto">
                    <p className="text-[9px] text-slate-500 leading-relaxed italic uppercase">
                      {"//"} System_Note: Images are processed through
                      Cloudinary Global CDN. Ensure sort_order doesn&apos;t
                      conflict with existing primary visuals.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      fetchProductImages(selectedProduct.id);
                    }}
                    className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold uppercase transition-all"
                  >
                    Reset_Buffer
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl uppercase tracking-widest disabled:opacity-20 transition-all shadow-lg shadow-cyan-900/20"
                  >
                    {uploading ? "Injecting_Data..." : "Confirm_Injection"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-slate-800 rounded-3xl text-slate-700 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
              [Waiting_for_target_selection]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
