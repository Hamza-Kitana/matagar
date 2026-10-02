import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBanner, PageHero } from "@/components/PageParts";
import { VALUES } from "@/data/site";
import { usePageTitle, useReveal } from "@/lib/useReveal";
import watchImage from "@/assets/smartwatch.jpg";
import earbudsImage from "@/assets/earbuds.jpg";
import chargerImage from "@/assets/charger.jpg";

export function AboutPage() {
  usePageTitle("من نحن — VYBE");
  useReveal();

  return (
    <main>
      <PageHero index="04 / 05" eyebrow="القصة ورا VYBE" title="بلّشنا من" accent="التفاصيل الصغيرة." watermark="ABOUT" crumb="من نحن"
        text="VYBE مش مجرد صفحة بتبيع إكسسوارات. إحنا ناس بنحب التكنولوجيا والستايل، وبنآمن إن القطعة الصح بتغيّر يومك.">
        <Button asChild size="large"><a href="/products">شوف المنتجات <ArrowLeft size={18} /></a></Button>
      </PageHero>

      <section className="story">
        <div className="section-topline reveal"><span>01 — قصتنا</span><span>OUR STORY</span></div>
        <div className="story-grid">
          <div className="story-copy reveal">
            <h2>كل إشي بلّش <em>بسؤال بسيط.</em></h2>
            <p>ليش الإكسسوارات الحلوة صعب تلاقيها؟ ولما تلاقيها، ليش التجربة معقدة؟ من هون إجت فكرة VYBE: مكان واحد بتلاقي فيه قطع مختارة بعناية، وبتحكي فيه مع ناس حقيقيين.</p>
            <p>بنختار كل قطعة على أساس شكلها، جودتها، وقديش رح تضيف ليومك. إذا ما كنا رح نستخدمها إحنا، ما بنعرضها.</p>
          </div>
          <div className="story-collage reveal" aria-hidden="true">
            <img src={watchImage} alt="" className="story-img story-img-a" loading="lazy" decoding="async" />
            <img src={earbudsImage} alt="" className="story-img story-img-b" loading="lazy" decoding="async" />
            <img src={chargerImage} alt="" className="story-img story-img-c" loading="lazy" decoding="async" />
            <span className="story-badge">✳ SINCE DAY ONE</span>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="section-topline reveal"><span>02 — شو بيميزنا</span><span>OUR VALUES</span></div>
        <div className="values-grid">
          {VALUES.map(({ icon: Icon, title, text }, index) => (
            <div className="value-card reveal" key={title} style={{ transitionDelay: `${index * 0.08}s` }}>
              <span className="value-index">0{index + 1}</span>
              <Icon size={30} strokeWidth={1.5} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <p className="reveal">“ إحنا ما بنبيع أغراض. <em>بنساعدك تعبّر عن حالك</em> بكل تفصيلة صغيرة بتحملها معك كل يوم. ”</p>
        <div className="about-marquee" aria-hidden="true"><div>YOUR STYLE ✳ YOUR RULES ✳ YOUR VYBE ✳ YOUR STYLE ✳ YOUR RULES ✳ YOUR VYBE ✳</div></div>
      </section>

      <CtaBanner title="صرت تعرفنا." accent="خلينا نتعرف عليك." text="ابعثلنا رسالة، أو ابدأ بتصفّح القطع اللي اخترناها إلك." />
    </main>
  );
}
