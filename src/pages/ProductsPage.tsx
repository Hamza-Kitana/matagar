import { useEffect, useRef, useState } from "react";
import { ArrowLeft, PackageSearch, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/PageParts";
import { categories, getCategory, products, productsIn, type CategoryId, type Product } from "@/data/products";
import { usePageTitle, useReveal } from "@/lib/useReveal";

const normalize = (text: string) => text.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();

const matches = (product: Product, query: string) =>
  normalize(`${product.name} ${product.english} ${product.tag} ${getCategory(product.category).name}`).includes(query);

export function ProductsPage({ onQuickAdd }: { onQuickAdd: (product: Product) => void }) {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<CategoryId>(categories[0]!.id);
  const tabsRef = useRef<HTMLElement>(null);
  const search = normalize(query);
  const results = search ? products.filter(product => matches(product, search)) : [];
  usePageTitle("المنتجات — VYBE");
  useReveal([search]);

  useEffect(() => {
    if (search) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setCurrent(visible.target.id as CategoryId);
    }, { rootMargin: "-40% 0px -55% 0px" });
    categories.forEach(category => {
      const el = document.getElementById(category.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [search]);

  useEffect(() => {
    const nav = tabsRef.current;
    const tab = nav?.querySelector<HTMLElement>(".is-active");
    if (!nav || !tab) return;
    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    nav.scrollBy?.({ left: tabRect.left + tabRect.width / 2 - (navRect.left + navRect.width / 2), behavior: "smooth" });
  }, [current]);

  return (
    <main>
      <PageHero index="02 / 05" eyebrow={`${products.length} قطعة بـ ${categories.length} أقسام`} title="كل القطع" accent="بمكان واحد." watermark="SHOP" crumb="المنتجات"
        text="ساعات، سماعات، شواحن، كفرات، سبيكرات، وإكسسوارات ذكية. اختار القسم أو دوّر على القطعة اللي ببالك." />

      <section className="listing">
        <div className="catalog-bar">
          <nav className="catalog-tabs" aria-label="أقسام المنتجات" ref={tabsRef}>
            {categories.map(({ id, name, icon: Icon }) => (
              <a key={id} href={`/products#${id}`} className={!search && current === id ? "catalog-tab is-active" : "catalog-tab"} onClick={() => setQuery("")}>
                <Icon size={16} strokeWidth={1.8} /> {name} <span className="filter-count">{productsIn(id).length}</span>
              </a>
            ))}
          </nav>
          <label className="catalog-search">
            <Search size={17} />
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="دوّر على قطعة…" aria-label="دوّر على منتج" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="امسح البحث"><X size={16} /></button>}
          </label>
        </div>

        {search ? (
          <div className="catalog-results">
            <div className="catalog-results-head"><h2>نتائج «{query.trim()}»</h2><span className="listing-count">{String(results.length).padStart(2, "0")} قطع</span></div>
            {results.length ? (
              <div className="product-grid">
                {results.map(product => <ProductCard key={product.id} product={product} onQuickAdd={() => onQuickAdd(product)} />)}
              </div>
            ) : (
              <p className="catalog-empty">ما لقينا إشي بهالاسم. جرّب كلمة ثانية، أو ابعثلنا وبندوّر عليها إلك.</p>
            )}
          </div>
        ) : categories.map((category, index) => {
          const items = productsIn(category.id);
          const Icon = category.icon;
          return (
            <section key={category.id} id={category.id} className="catalog-section" aria-labelledby={`${category.id}-title`}>
              <header className="catalog-head reveal">
                <span className="catalog-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="catalog-title">
                  <span className="catalog-english"><Icon size={15} strokeWidth={1.8} /> {category.english}</span>
                  <h2 id={`${category.id}-title`}>{category.name}</h2>
                  <p>{category.blurb}</p>
                </div>
                <span className="listing-count">{String(items.length).padStart(2, "0")} قطع</span>
              </header>
              <div className="product-grid catalog-grid">
                {items.map(product => <ProductCard key={product.id} product={product} onQuickAdd={() => onQuickAdd(product)} />)}
              </div>
            </section>
          );
        })}

        <div className="listing-request reveal">
          <span className="pdp-feature-icon"><PackageSearch size={24} strokeWidth={1.7} /></span>
          <div>
            <h3>مش لاقي اللي بدك إياه؟</h3>
            <p>ابعثلنا اسم القطعة أو صورتها، وبندوّر عليها إلك من خلال خدمة الطلب الخاص.</p>
          </div>
          <Button asChild variant="dark"><a href="/services">شوف الخدمات <ArrowLeft size={17} /></a></Button>
        </div>
      </section>
    </main>
  );
}
