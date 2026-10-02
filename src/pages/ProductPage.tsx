import { useState, type CSSProperties } from "react";
import { ArrowLeft, Check, Copy, Minus, Package, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductZoom } from "@/components/ProductZoom";
import { defaultSelection, getCategory, productsIn, selectionLabel, type Product } from "@/data/products";
import { usePageTitle, useReveal } from "@/lib/useReveal";

type ProductPageProps = {
  product: Product;
  onAdd: (product: Product, selection: Record<string, string>, quantity: number) => void;
  onOpenCart: () => void;
};

export function ProductPage({ product, onAdd, onOpenCart }: ProductPageProps) {
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const colorGroup = product.options.find(group => group.kind === "color");
  const color = colorGroup?.values.find(value => value.id === selection[colorGroup.id]);
  const category = getCategory(product.category);
  const related = productsIn(product.category).filter(item => item.id !== product.id).slice(0, 4);

  usePageTitle(`${product.name} — VYBE`);
  useReveal([product]);

  const add = () => {
    onAdd(product, selection, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  const copyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(`مرحباً، حابب أستفسر عن ${product.name} (${selectionLabel(product, selection)}) × ${quantity} من VYBE. شو السعر وهل متوفر؟`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch { setCopied(false); }
  };

  const style = { "--pdp-swatch": color?.swatch ?? "#c5fc62", "--pdp-tint": color?.tint ?? "#eef0f2" } as CSSProperties;

  return (
    <main className="pdp" style={style}>
      <section className="pdp-hero">
        <div className="pdp-aura" aria-hidden="true" />
        <nav className="pdp-crumbs hero-in" aria-label="مسار التنقل">
          <a href="/">الرئيسية</a><span>/</span><a href="/products">المنتجات</a><span>/</span><a href={`/products#${category.id}`}>{category.name}</a><span>/</span><strong>{product.name}</strong>
        </nav>

        <div className="pdp-grid">
          <div className="pdp-gallery hero-in" style={{ animationDelay: ".1s" }}>
            <ProductZoom images={product.images} alt={product.alt} number={product.number} tag={product.tag} color={color} />
          </div>

          <div className="pdp-info">
            <span className="pdp-eyebrow hero-in" style={{ animationDelay: ".15s" }}>{product.english} <i /> {category.name}</span>
            <h1 className="hero-in" style={{ animationDelay: ".22s" }}>{product.name}</h1>
            <p className="pdp-tagline hero-in" style={{ animationDelay: ".3s" }}>{product.tagline}</p>
            <p className="pdp-description hero-in" style={{ animationDelay: ".36s" }}>{product.description}</p>

            {product.options.map((group, index) => {
              const selected = group.values.find(value => value.id === selection[group.id]);
              return (
                <fieldset key={group.id} className="pdp-option hero-in" style={{ animationDelay: `${0.42 + index * 0.06}s` }}>
                  <legend>{group.label}: <strong>{selected?.label}</strong></legend>
                  <div className={group.kind === "color" ? "pdp-swatches" : "pdp-pills"}>
                    {group.values.map(value => {
                      const active = value.id === selection[group.id];
                      const choose = () => setSelection(current => ({ ...current, [group.id]: value.id }));
                      return group.kind === "color" ? (
                        <button key={value.id} type="button" className={active ? "pdp-swatch is-active" : "pdp-swatch"} style={{ "--swatch": value.swatch } as CSSProperties} onClick={choose} aria-pressed={active} aria-label={value.label} title={value.label}>
                          {active && <Check size={15} />}
                        </button>
                      ) : (
                        <button key={value.id} type="button" className={active ? "pdp-pill is-active" : "pdp-pill"} onClick={choose} aria-pressed={active}>{value.label}</button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

            <div className="pdp-buy hero-in" style={{ animationDelay: ".6s" }}>
              <div className="pdp-quantity" aria-label="الكمية">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="قلل الكمية"><Minus size={16} /></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => Math.min(9, q + 1))} aria-label="زود الكمية"><Plus size={16} /></button>
              </div>
              <Button size="large" className={added ? "pdp-add is-added" : "pdp-add"} onClick={add}>
                {added ? <><Check size={19} /> انضافت للسلة</> : <><ShoppingBag size={19} /> أضف للسلة</>}
              </Button>
            </div>
            <div className="pdp-secondary hero-in" style={{ animationDelay: ".66s" }}>
              <button type="button" onClick={copyInquiry}>{copied ? <><Check size={16} /> انسخ الاستفسار ✓</> : <><Copy size={16} /> انسخ استفسار عن هالقطعة</>}</button>
              <button type="button" onClick={onOpenCart}>افتح السلة <ArrowLeft size={16} /></button>
            </div>
            <p className="pdp-note hero-in" style={{ animationDelay: ".7s" }}>السعر والتوفر بتتأكد برسالة مباشرة على إنستغرام.</p>
          </div>
        </div>
      </section>

      <section className="pdp-features">
        <div className="section-topline reveal"><span>ليش بتحبها؟</span><span>WHY YOU'LL LOVE IT</span></div>
        <div className="pdp-feature-grid">
          {product.features.map(({ icon: Icon, title, text }, index) => (
            <div className="pdp-feature reveal" key={title} style={{ transitionDelay: `${index * 0.08}s` }}>
              <span className="pdp-feature-icon"><Icon size={24} strokeWidth={1.7} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="pdp-box reveal">
          <span className="pdp-box-icon"><Package size={28} strokeWidth={1.5} /></span>
          <div>
            <h3>شو بالعلبة؟</h3>
            <ul>{product.inBox.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="pdp-related">
        <div className="section-topline reveal"><span>من نفس القسم</span><a href={`/products#${category.id}`}>كل {category.name} ←</a></div>
        <div className="product-grid pdp-related-grid">
          {related.map(item => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>

      <div className="pdp-sticky">
        <div>
          <strong>{product.name}</strong>
          <span>{selectionLabel(product, selection)}</span>
        </div>
        <Button className={added ? "pdp-add is-added" : "pdp-add"} onClick={add}>{added ? <Check size={18} /> : <ShoppingBag size={18} />}{added ? "انضافت" : "أضف"}</Button>
      </div>
    </main>
  );
}