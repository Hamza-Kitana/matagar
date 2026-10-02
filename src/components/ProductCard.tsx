import { useRef, type PointerEvent } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsIn, type Product } from "@/data/products";

export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onPointerMove = (event: PointerEvent<T>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onPointerLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return { ref, onPointerMove, onPointerLeave };
}

export function ProductCard({ product, onQuickAdd }: { product: Product; onQuickAdd?: () => void }) {
  const tilt = useTilt<HTMLDivElement>();
  const colors = product.options.find(group => group.kind === "color")?.values ?? [];

  return (
    <article className="product-card reveal">
      <div className="product-tilt" {...tilt}>
        <a href={`/product/${product.id}`} className="product-image-wrap" aria-label={`صفحة ${product.name}`}>
          <img src={product.image} alt={product.alt} width={1024} height={1024} loading="lazy" decoding="async" />
          <span className="product-number">{product.number} / {String(productsIn(product.category).length).padStart(2, "0")}</span>
          <span className="product-tag">{product.tag}</span>
          <span className="product-view">شوف التفاصيل <ArrowLeft size={15} /></span>
          <span className="product-glare" aria-hidden="true" />
        </a>
        <div className="product-info">
          <div>
            <span className="product-english">{product.english}</span>
            <h3><a href={`/product/${product.id}`}>{product.name}</a></h3>
            <span className="product-swatches" aria-label={`${colors.length} ألوان`}>
              {colors.map(color => <i key={color.id} style={{ background: color.swatch }} title={color.label} />)}
            </span>
          </div>
          {onQuickAdd && <Button size="icon" variant="dark" className="add-button" onClick={onQuickAdd} aria-label={`أضف ${product.name} إلى السلة`} title={`أضف ${product.name} للسلة`}><Plus size={21} /></Button>}
        </div>
      </div>
    </article>
  );
}
