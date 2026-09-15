import { ShoppingCart, Package, ArrowRight } from "lucide-react";
import Image from "next/image";
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
}
interface Product {
  id: number;
  images: ProductImage[];
  name: string;
  base_price: number;
}

interface ProductImage {
  id: number;
  url: string;
}
export default function StepInventory({ cart, onNext }: any) {
  console.log(cart);
  const items = cart?.cartItems || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
        <ShoppingCart className="text-cyan-500" /> Manifest{" "}
        <span className="text-cyan-500">_REVIEW_</span>
      </h2>
      <div className="space-y-4">
        {items.map((item: Item) => (
          <div
            key={item.id}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex justify-between items-center group hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50">
                {item.variant?.product?.images?.[0]?.url ? (
                  <Image
                    src={item.variant.product.images[0].url}
                    alt="PROD"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    className="object-cover"
                  />
                ) : (
                  <Package className="m-auto text-slate-600" />
                )}
              </div>
              <div>
                <div className="text-[10px] text-cyan-500/50 font-black uppercase tracking-widest">
                  SKU: {item.variant.variant_sku}
                </div>
                <h3 className="font-bold uppercase italic text-white">
                  {item.variant.product.name}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-slate-600 uppercase font-black">
                Subtotal
              </div>
              <div className="font-black text-cyan-500">
                $
                {(
                  (Number(item.variant.product.base_price) +
                    Number(item.variant.price_modifier)) *
                  item.quantity
                ).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-end">
        <button
          onClick={onNext}
          className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 transition-all active:scale-95"
        >
          Confirm_Manifest <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
