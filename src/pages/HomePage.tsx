import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollObject } from "@/components/ScrollObject";
import { HeroVideo } from "@/components/HeroVideo";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, productsIn, type CategoryId, type Product } from "@/data/products";
import { useReveal } from "@/lib/useReveal";

const FEATURED = categories.map(category => productsIn(category.id)[0]!);

type HomePageProps = { onQuickAdd: (product: Product) => void; onOpenCart: () => void };

export function HomePage({ onQuickAdd, onOpenCart }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const active = categories.find(category => category.id === activeCategory);
  const shownProducts = active ? productsIn(active.id).slice(0, 6) : FEATURED;
  useReveal([activeCategory]);

  return (
    <>
      <ScrollObject />
      <main>
        <section className="hero" id="top">
          <HeroVideo />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow hero-in" style={{ animationDelay: ".1s" }}><span className="eyebrow-line" /> مش مجرد إكسسوارات</div>
              <h1>
                <span className="hero-line"><span style={{ animationDelay: ".2s" }}>خلي ستايلك</span></span>
                <span className="hero-line accent"><span style={{ animationDelay: ".35s" }}>يحكي عنك<span className="hero-star">✳</span></span></span>
              </h1>
              <p className="hero-in" style={{ animationDelay: ".55s" }}>قطع بتغيّر التفاصيل الصغيرة، وبتخلّي كل يوم إله طابع مختلف. اكتشف الأشياء اللي بتشبهك.</p>
              <div className="hero-actions hero-in" style={{ animationDelay: ".7s" }}>
                <Button asChild size="large" className="hero-cta"><a href="/#collection">اكتشف المجموعة <ArrowLeft size={19} /></a></Button>
                <a href="/about" className="hero-ghost">شو القصة؟</a>
              </div>
              <ul className="hero-chips hero-in" style={{ animationDelay: ".85s" }} aria-label="الفئات">
                {categories.map(category => <li key={category.id}><a href={`/products#${category.id}`}>{category.name}</a></li>)}
              </ul>
            </div>
            <div className="hero-side-label" aria-hidden="true">BEYOND THE ORDINARY — 2026</div>
          </div>
          <a href="/#statement" className="scroll-cue" aria-label="انزل لاكتشاف المزيد"><span className="scroll-mouse"><span /></span><span>اسحب لتكتشف</span></a>
          <div className="hero-index" aria-hidden="true">01 / 04</div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {Array.from({ length: 2 }, (_, i) => (
              <span key={i}>{categories.map(category => `${category.english} ✳ `).join("")}YOUR VYBE ✳&nbsp;</span>
            ))}
          </div>
        </div>

        <section className="statement" id="statement">
          <div className="section-topline reveal"><span>01 — البداية</span><span>EVERY DETAIL MATTERS</span></div>
          <div className="statement-content reveal">
            <span className="statement-asterisk" aria-hidden="true">✳</span>
            <h2>العادي؟ <em>مش جوّنا.</em><br />تفاصيلك تستاهل أكثر.</h2>
            <p>من أول سماعة بتلبسها لآخر لمسة على تلفونك؛ اختياراتنا معمولة عشان تضيف لمسة مختلفة لكل يوم.</p>
          </div>
          <div className="statement-bottom reveal"><span>SCROLL TO EXPLORE</span><ArrowDown size={20} /></div>
        </section>

        <section className="collection" id="collection">
          <div className="section-topline reveal"><span>02 — المجموعة</span><span>CURATED FOR YOU</span></div>
          <div className="collection-heading reveal"><div><span className="small-label">أشياء بدك إياها.</span><h2>اختار الـ <em>VYBE</em> تبعك.</h2></div><span className="collection-count">{products.length} قطعة / {String(categories.length).padStart(2, "0")} أقسام</span></div>
          <div className="filter-row" role="group" aria-label="تصنيف المنتجات">
            <Button variant="ghost" className={active ? "filter-button" : "filter-button selected"} onClick={() => setActiveCategory("all")} aria-pressed={!active}>مختارات</Button>
            {categories.map(category => <Button key={category.id} variant="ghost" className={activeCategory === category.id ? "filter-button selected" : "filter-button"} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>{category.name}</Button>)}
          </div>
          <div className="product-grid">
            {shownProducts.map(product => <ProductCard key={product.id} product={product} onQuickAdd={() => onQuickAdd(product)} />)}
          </div>
          <div className="collection-footer">
            <p className="collection-note">{active ? active.blurb : "كبّس على أي قطعة عشان تختار لونها وتفاصيلها، واسألنا عن السعر."}</p>
            <a href={active ? `/products#${active.id}` : "/products"} className="text-link">{active ? `كل ${active.name} (${productsIn(active.id).length})` : `كل المنتجات (${products.length})`} <ArrowLeft size={17} /></a>
          </div>
        </section>

        <section className="about" id="about">
          <div className="section-topline reveal"><span>03 — الفكرة</span><span>THE VYBE EFFECT</span></div>
          <div className="about-content reveal"><span className="about-spark">✳</span><div><span className="small-label">أكثر من مجرد قطعة</span><h2>مو بس تواكب<br />الترند. <em>إنت تصنعه.</em></h2><p>لأن التفاصيل الصغيرة هي اللي بتعمل الفرق الكبير. جمعنا لك إكسسوارات تخلي روتينك أذكى، وستايلك أجرأ.</p><a href="/about" className="text-link">اعرف قصتنا <ArrowUpLeft size={19} /></a></div></div>
          <div className="about-marquee" aria-hidden="true"><div>YOUR STYLE ✳ YOUR RULES ✳ YOUR VYBE ✳ YOUR STYLE ✳ YOUR RULES ✳ YOUR VYBE ✳</div></div>
        </section>

        <section className="contact" id="contact">
          <div className="section-topline reveal"><span>04 — تواصل معنا</span><span>LET'S TALK</span></div>
          <div className="contact-content reveal"><span className="small-label">لقيت شي عجبك؟</span><h2>القطعة الجاية<br /><em>بتنادي عليك.</em></h2><p>حط اللي عجبك بالسلة وانسخ طلبك، وبعدها ابعثلنا رسالة على إنستغرام للاستفسار عن السعر والتوفر.</p><div className="contact-actions"><Button size="large" onClick={onOpenCart} className="contact-cta">افتح السلة <ShoppingBag size={19} /></Button><a href="/contact" className="hero-ghost">صفحة التواصل</a></div></div>
        </section>
      </main>
    </>
  );
}
