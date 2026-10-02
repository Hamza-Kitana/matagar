import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from "lucide-react";
import type { OptionValue } from "@/data/products";

type ProductZoomProps = { images: string[]; alt: string; number: string; tag: string; color: OptionValue | undefined };

const pad = (value: number) => String(value).padStart(2, "0");

export function ProductZoom({ images, alt, number, tag, color }: ProductZoomProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef("mouse");
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const [zoomed, setZoomed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [active, setActive] = useState(0);
  const count = images.length;
  const current = images[active] ?? images[0] ?? "";
  const many = count > 1;

  const go = (step: number) => setActive(index => (index + step + count) % count);

  const aim = (event: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    el.style.setProperty("--zx", `${x.toFixed(2)}%`);
    el.style.setProperty("--zy", `${y.toFixed(2)}%`);
  };

  useEffect(() => {
    images.slice(1).forEach(src => { const img = new Image(); img.src = src; });
  }, [images]);

  useEffect(() => {
    if (!fullscreen) return;
    document.body.style.overflow = "hidden";
    // RTL: the left arrow moves forward.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
      else if (event.key === "ArrowLeft") setActive(index => (index + 1) % count);
      else if (event.key === "ArrowRight") setActive(index => (index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [fullscreen, count]);

  const arrows = (className: string) => many && (
    <>
      <button type="button" className={`${className} is-prev`} onClick={event => { event.stopPropagation(); go(-1); }} aria-label="الصورة السابقة">
        <ChevronRight size={20} />
      </button>
      <button type="button" className={`${className} is-next`} onClick={event => { event.stopPropagation(); go(1); }} aria-label="الصورة التالية">
        <ChevronLeft size={20} />
      </button>
    </>
  );

  return (
    <>
      <div
        ref={stageRef}
        className={zoomed ? "pdp-stage is-zoomed" : "pdp-stage"}
        onPointerDown={event => {
          pointerType.current = event.pointerType;
          swiped.current = false;
          swipeStart.current = event.pointerType !== "mouse" && !zoomed ? event.clientX : null;
        }}
        onPointerUp={event => {
          if (swipeStart.current === null || !many) return;
          const delta = event.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(delta) < 40) return;
          swiped.current = true;
          go(delta > 0 ? 1 : -1);
        }}
        onPointerMove={event => {
          if (event.pointerType === "mouse") {
            const onControl = (event.target as HTMLElement).closest("button") !== null;
            setZoomed(!onControl);
            if (!onControl) aim(event);
          } else if (zoomed) aim(event);
        }}
        onPointerLeave={event => { if (event.pointerType === "mouse") setZoomed(false); }}
        onClick={event => {
          if (swiped.current) return;
          if (pointerType.current === "mouse") { setFullscreen(true); return; }
          aim(event);
          setZoomed(value => !value);
        }}
      >
        <span className="pdp-ghost-number" aria-hidden="true">{number}</span>
        <div className="pdp-photo">
          <div className="pdp-zoom">
            <img key={current} src={current} alt={`${alt} — ${color?.label ?? ""}`} width={1024} height={1024} />
          </div>
        </div>
        <span className="pdp-zoom-hint" aria-hidden="true">
          <ZoomIn size={14} />
          <span className="pdp-hint-mouse">مرّر للتكبير · كبّس لعرض كامل</span>
          <span className="pdp-hint-touch">اضغط للتكبير</span>
        </span>
        <button type="button" className="pdp-fullscreen" onClick={event => { event.stopPropagation(); setFullscreen(true); }} aria-label="عرض الصورة بكامل الشاشة">
          <Maximize2 size={17} />
        </button>
        {arrows("pdp-arrow")}
        <span className="pdp-stage-tag">{tag}</span>
        {color && <span className="pdp-stage-color"><i style={{ background: color.swatch }} />{color.label}</span>}
      </div>

      {many && (
        <div className="pdp-thumbs">
          <div className="pdp-thumbs-list" role="tablist" aria-label="صور المنتج">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`الصورة ${index + 1}`}
                className={index === active ? "pdp-thumb is-active" : "pdp-thumb"}
                onClick={() => setActive(index)}
              >
                <img src={src} alt="" loading="lazy" width={160} height={160} />
              </button>
            ))}
          </div>
          <span className="pdp-thumbs-count" dir="ltr"><b>{pad(active + 1)}</b> / {pad(count)}</span>
        </div>
      )}

      {/* Portaled because the animated gallery ancestor would otherwise trap the fixed overlay. */}
      {fullscreen && createPortal(
        <div className="pdp-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setFullscreen(false)}>
          <img key={current} src={current} alt={alt} onClick={event => event.stopPropagation()} />
          <button type="button" className="pdp-lightbox-close" onClick={() => setFullscreen(false)} aria-label="سكّر"><X size={22} /></button>
          {arrows("pdp-lightbox-arrow")}
          {many && <span className="pdp-lightbox-count" dir="ltr">{pad(active + 1)} / {pad(count)}</span>}
          {color && <span className="pdp-lightbox-color"><i style={{ background: color.swatch }} />{color.label}</span>}
        </div>,
        document.body,
      )}
    </>
  );
}
