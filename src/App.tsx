import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/PageParts";
import { CartDrawer, type CartLine } from "@/components/CartDrawer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { defaultSelection, getProduct, type Product } from "@/data/products";
import { navigate, scrollToHash, useLocation, wasPopNavigation } from "@/lib/router";
import { usePageTitle } from "@/lib/useReveal";

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame = 0;
    const tick = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      ref.current?.style.setProperty("transform", `translate3d(${cx}px, ${cy}px, 0)`);
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      ref.current?.classList.add("is-active");
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", onMove); };
  }, []);

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

function NotFoundPage() {
  usePageTitle("الصفحة مش موجودة — VYBE");
  return (
    <main className="pdp pdp-missing">
      <span className="not-found-code" aria-hidden="true">404</span>
      <h1>الصفحة هاي مش موجودة</h1>
      <p>يمكن الرابط غلط، أو الصفحة انشالت.</p>
      <Button asChild size="large"><a href="/">ارجع للرئيسية <ArrowLeft size={18} /></a></Button>
    </main>
  );
}

const lineKey = (productId: string, selection: Record<string, string>) =>
  [productId, ...Object.keys(selection).sort().map(key => `${key}:${selection[key]}`)].join("|");

const PAGE_TITLES: Record<string, string> = { "/products": "المنتجات", "/services": "الخدمات", "/about": "من نحن", "/contact": "تواصل معنا" };

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

export function App() {
  const location = useLocation();
  const path = normalize(location.path);
  const { hash } = location;
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartMounted, setCartMounted] = useState(false);
  const homeScroll = useRef(0);
  const lastPath = useRef<string | null>(null);
  const productId = path.match(/^\/product\/([\w-]+)$/)?.[1];
  const product = productId ? getProduct(productId) : undefined;
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href?.startsWith("/") || anchor.target === "_blank") return;
      event.preventDefault();
      if (window.location.pathname === "/" && !href.startsWith("/#")) homeScroll.current = window.scrollY;
      navigate(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useLayoutEffect(() => {
    const samePage = lastPath.current === path;
    lastPath.current = path;
    if (hash) {
      // A long smooth scroll on a freshly mounted page gets cut short by loading content, so jump there instead.
      requestAnimationFrame(() => scrollToHash(hash, samePage));
    } else if (path === "/" && wasPopNavigation()) {
      window.scrollTo({ top: homeScroll.current, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [path, hash]);

  useEffect(() => {
    if (!cartOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setCartOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [cartOpen]);

  const addToCart = (item: Product, selection: Record<string, string>, quantity: number) => {
    const key = lineKey(item.id, selection);
    setCart(current => current.some(line => line.key === key)
      ? current.map(line => line.key === key ? { ...line, quantity: line.quantity + quantity } : line)
      : [...current, { key, productId: item.id, selection, quantity }]);
  };

  const quickAdd = (item: Product) => {
    addToCart(item, defaultSelection(item), 1);
    openCart();
  };

  const changeLine = (key: string, change: number) => setCart(current =>
    current.flatMap(line => line.key !== key ? [line] : line.quantity + change > 0 ? [{ ...line, quantity: line.quantity + change }] : []));

  function openCart() { setCartMounted(true); setCartOpen(true); }
  const unmountCart = useCallback(() => setCartMounted(false), []);

  let page;
  if (path === "/") page = <HomePage onQuickAdd={quickAdd} onOpenCart={openCart} />;
  else if (path === "/products") page = <ProductsPage onQuickAdd={quickAdd} />;
  else if (path === "/services") page = <ServicesPage />;
  else if (path === "/about") page = <AboutPage />;
  else if (path === "/contact") page = <ContactPage />;
  else if (product) page = <ProductPage key={product.id} product={product} onAdd={addToCart} onOpenCart={openCart} />;
  else page = <NotFoundPage />;

  const title = product?.name ?? PAGE_TITLES[path];
  const isTabPage = path === "/" || ["/products", "/services", "/contact"].includes(path);
  const backTo = product ? `/products#${product.category}` : isTabPage ? undefined : "/";
  const shellClass = ["site-shell", path === "/" ? "page-home" : "page-inner", product && "page-product"].filter(Boolean).join(" ");

  return (
    <div className={shellClass}>
      <CursorGlow />
      <SiteHeader path={path} cartCount={cartCount} onOpenCart={openCart} title={title} backTo={backTo} />
      <div className="page-transition" key={path}>{page}</div>
      <SiteFooter />
      {!product && <MobileTabBar path={path} cartCount={cartCount} onOpenCart={openCart} />}
      {cartMounted && <CartDrawer lines={cart} closing={!cartOpen} onClosed={unmountCart} onClose={() => setCartOpen(false)} onChange={changeLine} onBrowse={() => { setCartOpen(false); navigate("/products"); }} />}
    </div>
  );
}
