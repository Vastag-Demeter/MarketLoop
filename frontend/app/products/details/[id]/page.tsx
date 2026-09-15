"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import api from "@/src/axios";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  variants: Variant[];
  description: string;
  base_price: number;
  images: ProductImage[];
  category: Category;
  vendor: {
    id: number;
    name: string;
  };
}
interface Category {
  id: number;
  name: string;
}

interface SingleVariant {
  id: number;
  attributeValue: AttributeValue;
}
interface Variant {
  id: number;
  attributeValues: AttributeValue[];
  price_modifier: number;
  stock: number;
}
interface AttributeValue {
  id: number;
  value: string;
  attribute: Attribute;
}

interface Attribute {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  url: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { cart, fetchCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const handleAddToCart = async () => {
    if (!cart?.id) {
      toast.error("SYSTEM_OFFLINE: CART_BUFFER_NOT_FOUND");
      return;
    }
    if (!activeVariant) {
      toast.error("DATA_INCOMPLETE: PLEASE_SELECT_ALL_SPECIFICATIONS");
      return;
    }

    const variantId = activeVariant.id;

    const promise = api.post("/api/addCartItem", {
      cart_id: cart.id,
      variant_id: variantId,
      quantity: 1,
      selected_attributes: selectedOptions,
    });

    toast.promise(promise, {
      loading: "UPLOADING_TO_BUFFER...",
      success: () => {
        fetchCart(true);
        return "ASSET_STAGED_SUCCESSFULLY";
      },
      error: (err) => err.response?.data?.error || "UPLOAD_FAILED",
    });
  };
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/getProduct/${id}`);
        const data = res.data.data;
        setProduct(data);

        if (data.images?.length > 0) setActiveImage(data.images[0].url);

        if (data.variants?.length > 0) {
          const initialOptions: Record<string, string> = {};
          data.variants[0].attributeValues.forEach((av: SingleVariant) => {
            initialOptions[av.attributeValue.attribute.name] =
              av.attributeValue.value;
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err) {
        console.error(err);
        toast.error("FAILED_TO_SYNC_WITH_DATABASE:");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const attributesMap = useMemo(() => {
    if (!product?.variants) return {};
    const map: Record<string, Set<string>> = {};

    product.variants.forEach((v: Variant) => {
      v.attributeValues.forEach((av: any) => {
        const attrName = av.attributeValue.attribute.name;
        const val = av.attributeValue.value;
        if (!map[attrName]) map[attrName] = new Set();
        map[attrName].add(val);
      });
    });
    return map;
  }, [product]);

  const activeVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v: Variant) =>
      v.attributeValues.every(
        (av: any) =>
          selectedOptions[av.attributeValue.attribute.name] ===
          av.attributeValue.value,
      ),
    );
  }, [selectedOptions, product]);

  useEffect(() => {
    console.log(product);
  }, [product]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-mono animate-pulse uppercase tracking-[0.5em]">
        Syncing_Data_Stream...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-rose-500 font-mono">
        NODE_NOT_FOUND
      </div>
    );

  const totalPrice = product.base_price + (activeVariant?.price_modifier || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono pt-28 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)]">
            <Image
              src={activeImage}
              alt="Product display"
              fill
              priority={true}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img: ProductImage) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`relative aspect-square border-2 overflow-hidden rounded-lg transition-all ${
                  activeImage === img.url
                    ? "border-cyan-500"
                    : "border-slate-800"
                }`}
              >
                <Image
                  src={img.url}
                  fill
                  alt="Product thumbnail"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-2">
              Category: {product.category.name}
            </p>
            <p className="text-[10px] text-slate-500 tracking-[0.3em] mb-2">
              VENDOR: {product.vendor.name}
            </p>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-cyan-400 tracking-tighter">
                ${totalPrice.toLocaleString()}
              </span>
              {(activeVariant?.price_modifier ?? 0) > 0 && (
                <span className="text-[10px] text-slate-500 tracking-widest uppercase italic">
                  Includes_Modifier
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 uppercase leading-relaxed mb-10 border-l border-slate-800 pl-4">
            {product.description}
          </p>

          <div className="space-y-8 mb-10">
            {Object.entries(attributesMap).map(([attrName, values]) => (
              <div key={attrName}>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
                  Select_{attrName}
                </h3>
                <div className="flex gap-3">
                  {Array.from(values).map((val: any) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [attrName]: val,
                        }))
                      }
                      className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                        selectedOptions[attrName] === val
                          ? "bg-cyan-600 border-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                          : "border-slate-800 text-slate-500 hover:border-slate-600"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-900">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] uppercase tracking-widest text-slate-500">
                Inventory_Status:
              </span>
              <span
                className={`text-[10px] font-black uppercase ${(activeVariant?.stock ?? 0) > 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                {activeVariant
                  ? `${activeVariant.stock} UNITS_AVAILABLE`
                  : "VARIANT_NOT_MAPPED"}
              </span>
            </div>

            <button
              onClick={() => {
                handleAddToCart();
              }}
              disabled={!activeVariant || activeVariant.stock <= 0}
              className="w-full py-5 bg-white hover:bg-cyan-500 text-slate-950 font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all disabled:opacity-20 disabled:grayscale shadow-xl active:scale-95"
            >
              Add_To_Cart_Buffer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
