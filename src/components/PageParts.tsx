import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpLeft, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, NAV_LINKS } from "@/data/site";

type PageHeroProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  accent: ReactNode;
  text: string;
  watermark: string;
  crumb: string;
  children?: ReactNode;
};

export function PageHero({ index, eyebrow, title, accent, text, watermark, crumb, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-aura" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <span className="page-hero-watermark" aria-hidden="true">{watermark}</span>
      <div className="page-hero-inner">
        <nav className="pdp-crumbs hero-in" aria-label="مسار التنقل">
          <a href="/">الرئيسية</a><span>/</span><strong>{crumb}</strong>
        </nav>
        <div className="eyebrow hero-in" style={{ animationDelay: ".1s" }}><span className="eyebrow-line" /> {eyebrow}</div>
        <h1>
          <span className="hero-line"><span style={{ animationDelay: ".18s" }}>{title}</span></span>
          <span className="hero-line accent"><span style={{ animationDelay: ".3s" }}>{accent}</span></span>
        </h1>
        <p className="hero-in" style={{ animationDelay: ".45s" }}>{text}</p>
        {children && <div className="page-hero-actions hero-in" style={{ animationDelay: ".55s" }}>{children}</div>}
      </div>
      <span className="page-hero-index" aria-hidden="true">{index}</span>
    </section>
  );
}

export function CtaBanner({ title, accent, text }: { title: string; accent: string; text: string }) {
  return (
    <section className="cta-banner">
      <div className="cta-banner-inner reveal">
        <span className="cta-banner-star" aria-hidden="true">✳</span>
        <div>
          <h2>{title} <em>{accent}</em></h2>
          <p>{text}</p>
        </div>
        <div className="cta-banner-actions">
          <Button asChild size="large"><a href="/products">تصفّح المنتجات <ArrowLeft size={18} /></a></Button>
          <Button asChild size="large" variant="outline"><a href="/contact">احكي معنا</a></Button>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <a href="/" className="footer-brand">VYBE<span>.</span></a>
          <p>إكسسوارات موبايل، ساعات ذكية، وسماعات مختارة بعناية. تفاصيل تفرق، وستايل يبقى.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="site-footer-social"><Instagram size={18} /> @{INSTAGRAM_HANDLE}</a>
        </div>
        <div className="site-footer-col">
          <h3>الصفحات</h3>
          {NAV_LINKS.map(link => <a key={link.to} href={link.to}>{link.label}</a>)}
        </div>
        <div className="site-footer-col">
          <h3>الأقسام</h3>
          {categories.map(category => <a key={category.id} href={`/products#${category.id}`}>{category.name}</a>)}
        </div>
        <div className="site-footer-col site-footer-cta">
          <h3>عندك سؤال؟</h3>
          <p>ابعثلنا رسالة وبنرد عليك بالسعر والتوفر.</p>
          <a href="/contact" className="text-link">تواصل معنا <ArrowUpLeft size={17} /></a>
        </div>
      </div>
      <div className="site-footer-word" aria-hidden="true">VYBE</div>
      <div className="site-footer-bottom">
        <span>© 2026 VYBE. كل الحقوق محفوظة.</span>
        <a href="#" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>للأعلى ↑</a>
      </div>
    </footer>
  );
}
