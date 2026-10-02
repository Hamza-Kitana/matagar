import type { CSSProperties } from "react";
import { House, LayoutGrid, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";

type MobileTabBarProps = { path: string; cartCount: number; onOpenCart: () => void };

const TABS = [
  { to: "/", label: "الرئيسية", icon: House },
  { to: "/products", label: "المنتجات", icon: LayoutGrid },
  { to: "/services", label: "الخدمات", icon: Sparkles },
  { to: "/contact", label: "تواصل", icon: MessageCircle },
] as const;

const tap = () => navigator.vibrate?.(8);

export function MobileTabBar({ path, cartCount, onOpenCart }: MobileTabBarProps) {
  const active = TABS.findIndex(tab => tab.to === "/" ? path === "/" : path.startsWith(tab.to));
  // The cart sits in the middle slot, so tabs after it shift one position.
  const slot = active < 0 ? -1 : active >= 2 ? active + 1 : active;

  return (
    <nav className="tabbar" aria-label="تنقل التطبيق" style={{ "--slot": slot } as CSSProperties}>
      <span className={slot < 0 ? "tabbar-indicator is-idle" : "tabbar-indicator"} aria-hidden="true" />
      {TABS.slice(0, 2).map(tab => <Tab key={tab.to} {...tab} active={TABS[active]?.to === tab.to} />)}
      <button type="button" className="tabbar-cart" onClick={() => { tap(); onOpenCart(); }} aria-label={`السلة، ${cartCount} منتجات`}>
        <span className="tabbar-cart-icon">
          <ShoppingBag size={22} strokeWidth={2} />
          {cartCount > 0 && <b key={cartCount}>{cartCount}</b>}
        </span>
        <span>السلة</span>
      </button>
      {TABS.slice(2).map(tab => <Tab key={tab.to} {...tab} active={TABS[active]?.to === tab.to} />)}
    </nav>
  );
}

function Tab({ to, label, icon: Icon, active }: (typeof TABS)[number] & { active: boolean }) {
  return (
    <a href={to} className={active ? "tabbar-tab is-active" : "tabbar-tab"} aria-current={active ? "page" : undefined} onClick={tap}>
      <Icon size={21} strokeWidth={active ? 2.3 : 1.8} />
      <span>{label}</span>
    </a>
  );
}
