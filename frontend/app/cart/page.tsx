"use client";
import { useCart } from "@/src/context/CartContext";
import Link from "next/link";
import api from "@/src/axios";
import { toast } from "sonner";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
const sessionID = Cookies.get("cart_session_id");

interface Item {
  id: number;
  variant: Variant;
  quantity: number;
}
interface Variant {
  id: number;
  product: Product;
  variant_sku: string;
  price_modifier: number;
  attributeValues: AttributeValue[];
}
interface Product {
  id: number;
  images: ProductImage[];
  name: string;
  base_price: number;
}
interface AttributeValue {
  id: number;
  attributeValue: {
    value: string;
  };
}
interface ProductImage {
  id: number;
  url: string;
}

export default function CartPage() {
  const { cart, fetchCart } = useCart();

  useEffect(() => {
    fetchCart(false);
  }, [fetchCart]);
  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put("/api/updateCartItem", {
        id: itemId,
        quantity: newQty,
        session_token: sessionID,
      });
      fetchCart(true);
    } catch (err) {
      console.log(err);
      toast.error("QUANTITY_SYNC_FAILED");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/api/deleteCartItem/${itemId}`, {
        data: { session_token: sessionID },
      });
      toast.success("ASSET_REMOVED_FROM_BUFFER");
      fetchCart(true);
    } catch (err) {
      console.log(err);
      toast.error("REMOVE_FAILED");
    }
  };

  if (cart === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono">
        <div className="w-16 h-1 bg-slate-800 overflow-hidden mb-4">
          <div className="w-full h-full bg-cyan-500 animate-pulse" />
        </div>
        <div className="text-cyan-500 text-[10px] uppercase tracking-[0.5em]">
          Synchronizing_Registry...
        </div>
      </div>
    );
  }
  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono p-8 text-center">
        <div className="mb-8 p-12 border border-dashed border-slate-800 rounded-3xl">
          <div className="text-slate-700 text-[10px] uppercase tracking-[0.5em] mb-4 animate-pulse">
            [Empty_Cart_Registry]
          </div>
          <p className="text-slate-500 text-xs mb-8 max-w-[250px] leading-relaxed">
            No active hardware signatures detected in your current session
            buffer.
          </p>
          <Link
            href="/products"
            className="px-8 py-3 bg-white text-slate-950 text-[10px] uppercase font-black hover:bg-cyan-500 transition-all rounded-xl"
          >
            Return_To_Inventory
          </Link>
        </div>
      </div>
    );
  }
  const subtotal = cart.cartItems.reduce((acc: number, item: Item) => {
    const basePrice = item.variant?.product.base_price || 0;
    const modifier = item.variant?.price_modifier || 0;
    return acc + (basePrice + modifier) * item.quantity;
  }, 0);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono pt-32 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-12 border-l-4 border-cyan-500 pl-6">
          Shopping_Cart_<span className="text-cyan-500">Registry</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="hidden md:grid grid-cols-12 px-6 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
              <div className="col-span-6">Asset_Description</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total_Price</div>
            </div>

            {cart.cartItems.map((item: Item) => {
              const unitPrice =
                item.variant.product.base_price +
                (item.variant?.price_modifier || 0);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 items-center bg-slate-900/20 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-xl group hover:border-slate-700 transition-all"
                >
                  <div className="col-span-6 flex items-center gap-6">
                    <div className="relative w-20 h-20 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                      <Image
                        src={item.variant.product.images?.[0].url}
                        alt="Product image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        fill
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase mb-1">
                        {item.variant.product.name}
                      </h3>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter">
                        Variant:{" "}
                        {item.variant?.attributeValues?.[0]?.attributeValue
                          ?.value || "Default"}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[8px] text-rose-500 uppercase font-black mt-3 hover:underline opacity-0 group-hover:opacity-100 transition-all"
                      >
                        [Eject_Item]
                      </button>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-center items-center gap-4 py-4 md:py-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-slate-800 rounded-lg hover:bg-slate-800 text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-slate-800 rounded-lg hover:bg-slate-800 text-xs"
                    >
                      +
                    </button>
                  </div>

                  <div className="col-span-3 text-right">
                    <div className="text-sm font-bold text-cyan-400">
                      ${(unitPrice * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-[8px] text-slate-600 uppercase italic">
                      ${unitPrice.toLocaleString()} / UNIT
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl sticky top-32">
              <h2 className="text-xs font-black uppercase text-white mb-6 tracking-widest">
                Order_Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[10px] uppercase">
                  <span className="text-slate-500">Subtotal_Buffer</span>
                  <span className="text-slate-300">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] uppercase">
                  <span className="text-slate-500">Estimated_Tax</span>
                  <span className="text-slate-300">$0.00</span>
                </div>
                <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
                  <span className="text-[10px] uppercase font-black text-cyan-500">
                    Final_Cost
                  </span>
                  <span className="text-2xl font-black text-white">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest"
              >
                <button className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all shadow-xl shadow-cyan-900/20 active:scale-95">
                  Proceed_to_checkout
                </button>
              </Link>
              <div className="mt-6 flex items-center justify-center gap-2 grayscale opacity-30">
                <div className="w-8 h-5 bg-slate-700 rounded-sm" />
                <div className="w-8 h-5 bg-slate-700 rounded-sm" />
                <div className="w-8 h-5 bg-slate-700 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
