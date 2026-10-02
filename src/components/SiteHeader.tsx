import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpLeft, Instagram, Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, NAV_LINKS } from "@/data/site";
import { goBack } from "@/lib/router";

type SiteHeaderProps = { path: string; cartCount: number; onOpenCart: () => void; title?: string | undefined; backTo?: string | undefined };

const isActive = (to: string, path: string) =>
  to === "/" ? path === "/" : path === to || (to === "/products" && path.startsWith("/product/"));

export function SiteHeader({ path, cartCount, onOpenCart, title, backTo }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progressRef.current?.style.setProperty("transform", `scaleX(${y / max})`);
      setScrolled(y > 30);
      if (Math.abs(y - lastY) > 8) {
        setHidden(y > lastY && y > window.innerHeight * 0.8);
        lastY = y;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [path]);

  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const headerClass = ["site-header", scrolled && "is-scrolled", hidden && !menuOpen && "is-hidden", menuOpen && "menu-open"].filter(Boolean).join(" ");

  return (
    <>
      <div className="scroll-progress" ref={progressRef} />
      <header className={headerClass}>
        <div className="header-bar">
          <div className="header-start">
            {backTo && (
              <button type="button" className="header-back" onClick={() => goBack(backTo)} aria-label="رجوع">
                <ArrowRight size={20} />
              </button>
            )}
            <div className={title ? "header-identity has-title" : "header-identity"}>
              <a href="/" className="brand" aria-label="VYBE - الرئيسية">VYBE<span className="brand-dot">.</span></a>
              {title && <span className="header-title" aria-hidden="true">{title}</span>}
            </div>
          </div>
          <nav className="site-nav" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map(link => {
              const active = isActive(link.to, path);
              return <a key={link.to} href={link.to} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>{link.label}</a>;
            })}
          </nav>
          <div className="header-actions">
            <a href="/contact" className="header-cta">احكي معنا <ArrowUpLeft size={15} /></a>
            <Button variant="ghost" size="icon" aria-label={`السلة، ${cartCount} منتجات`} title="السلة" onClick={onOpenCart} className="cart-trigger">
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && <span className="cart-badge" key={cartCount}>{cartCount}</span>}
            </Button>
            <Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </Button>
          </div>
        </div>
      </header>
      <div className={menuOpen ? "mobile-nav is-open" : "mobile-nav"} aria-hidden={!menuOpen}>
        <nav aria-label="قائمة الموبايل">
          {NAV_LINKS.map((link, index) => (
            <a key={link.to} href={link.to} className={isActive(link.to, path) ? "is-active" : undefined} tabIndex={menuOpen ? 0 : -1} style={{ transitionDelay: menuOpen ? `${0.08 + index * 0.06}s` : "0s" }} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{link.label}
            </a>
          ))}
        </nav>
        <div className="mobile-nav-footer">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}><Instagram size={18} /> @{INSTAGRAM_HANDLE}</a>
          <p>تفاصيل تفرق. ستايل يبقى.</p>
        </div>
      </div>
    </>
  );
}
