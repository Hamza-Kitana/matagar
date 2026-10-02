import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, Instagram, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProduct, selectionLabel } from "@/data/products";

export type CartLine = { key: string; productId: string; selection: Record<string, string>; quantity: number };

type CartDrawerProps = {
  lines: CartLine[];
  closing: boolean;
  onClosed: () => void;
  onClose: () => void;
  onChange: (key: string, change: number) => void;
  onBrowse: () => void;
};

export function CartDrawer({ lines, closing, onClosed, onClose, onChange, onBrowse }: CartDrawerProps) {
  const [copied, setCopied] = useState(false);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const panelRef = useRef<HTMLElement>(null);
  const drag = useRef<{ start: number; offset: number } | null>(null);

  const endDrag = () => {
    const panel = panelRef.current;
    const offset = drag.current?.offset ?? 0;
    drag.current = null;
    if (!panel) return;
    if (offset > 110) { onClose(); return; }
    panel.style.transition = "transform .45s cubic-bezier(.16,1,.3,1)";
    panel.style.transform = "";
  };

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClosed, 600);
    return () => window.clearTimeout(timer);
  }, [closing, onClosed]);

  const copyOrder = async () => {
    const rows = lines.flatMap(line => {
      const product = getProduct(line.productId);
      return product ? [`${product.name} (${selectionLabel(product, line.selection)}) × ${line.quantity}`] : [];
    });
    try {
      await navigator.clipboard.writeText(`مرحباً، حابب أستفسر عن المنتجات التالية من VYBE:\n${rows.join("\n")}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch { setCopied(false); }
  };

  return (
    <div className={closing ? "cart-overlay is-closing" : "cart-overlay"} role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <aside
        ref={panelRef}
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-label="سلة المنتجات"
        onAnimationEnd={event => { if (closing && event.target === event.currentTarget) onClosed(); }}
      >
        <div
          className="cart-head"
          onPointerDown={event => {
            if (!window.matchMedia("(max-width: 767px)").matches || (event.target as HTMLElement).closest("button")) return;
            drag.current = { start: event.clientY, offset: 0 };
            event.currentTarget.setPointerCapture(event.pointerId);
            panelRef.current?.style.setProperty("transition", "none");
          }}
          onPointerMove={event => {
            if (!drag.current) return;
            drag.current.offset = Math.max(0, event.clientY - drag.current.start);
            panelRef.current?.style.setProperty("transform", `translateY(${drag.current.offset}px)`);
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div><span className="small-label">اختياراتك</span><h2>السلة <span>({count})</span></h2></div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="إغلاق السلة"><X size={24} /></Button>
        </div>
        <div className="cart-items">
          {lines.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={42} strokeWidth={1.2} />
              <h3>لسّه السلة فاضية</h3>
              <p>في قطع حلوة مستنيّتك بالمجموعة.</p>
              <Button onClick={onBrowse}>تصفح المجموعة <ArrowLeft size={17} /></Button>
            </div>
          ) : lines.map((line, index) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            const color = product.options.find(group => group.kind === "color")?.values.find(value => value.id === line.selection["color"]);
            return (
              <div className="cart-item" key={line.key} style={{ "--i": Math.min(index, 6) } as CSSProperties}>
                <a href={`/product/${product.id}`} onClick={onClose} className="cart-item-image" style={{ background: color?.tint }}>
                  <img src={product.image} alt={product.alt} width={96} height={96} decoding="async" />
                </a>
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <span className="cart-item-options">
                    {color && <i className="cart-swatch" style={{ background: color.swatch }} />}
                    {selectionLabel(product, line.selection)}
                  </span>
                  <div className="quantity-control">
                    <Button variant="ghost" size="icon" onClick={() => onChange(line.key, -1)} aria-label={`قلل ${product.name}`}><Minus size={15} /></Button>
                    <span>{line.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => onChange(line.key, 1)} aria-label={`زود ${product.name}`}><Plus size={15} /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {lines.length > 0 && (
          <div className="cart-bottom">
            <p>الأسعار والتوفر بتتأكد برسالة مباشرة.</p>
            <Button className="copy-button" onClick={copyOrder}>{copied ? <><Check size={18} /> تم نسخ الطلب</> : <><Instagram size={18} /> انسخ الطلب وابعثه على إنستغرام</>}</Button>
            <span>انسخ التفاصيل وأرسلها لحسابنا على إنستغرام.</span>
          </div>
        )}
      </aside>
    </div>
  );
}
