import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBanner, PageHero } from "@/components/PageParts";
import { FAQS, ORDER_STEPS, SERVICES } from "@/data/site";
import { usePageTitle, useReveal } from "@/lib/useReveal";

export function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(0);
  usePageTitle("الخدمات — VYBE");
  useReveal();

  return (
    <main>
      <PageHero index="03 / 05" eyebrow="أكثر من متجر" title="خدمات بتخلّي" accent="تجربتك أسهل." watermark="SERVICES" crumb="الخدمات"
        text="من طلب قطعة خاصة لتغليف الهدايا والطلبات بالجملة؛ إحنا هون عشان نساعدك تلاقي اللي بدك إياه بالطريقة اللي بتريحك.">
        <Button asChild size="large"><a href="/contact">اطلب خدمة <ArrowLeft size={18} /></a></Button>
        <a href="#how" className="hero-ghost">كيف بتطلب؟</a>
      </PageHero>

      <section className="services">
        <div className="section-topline reveal"><span>01 — شو بنقدّم</span><span>WHAT WE OFFER</span></div>
        <div className="services-grid">
          {SERVICES.map(({ icon: Icon, title, text }, index) => (
            <article className="service-card reveal" key={title} style={{ transitionDelay: `${(index % 3) * 0.08}s` }}>
              <span className="service-number">0{index + 1}</span>
              <span className="pdp-feature-icon"><Icon size={24} strokeWidth={1.7} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="/contact" className="service-link" aria-label={`اطلب ${title}`}>اطلبها <ArrowLeft size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="steps" id="how">
        <div className="section-topline reveal"><span>02 — كيف بتطلب</span><span>HOW IT WORKS</span></div>
        <h2 className="steps-title reveal">أربع خطوات، <em>وبس.</em></h2>
        <ol className="steps-list">
          {ORDER_STEPS.map((step, index) => (
            <li className="step reveal" key={step.title} style={{ transitionDelay: `${index * 0.1}s` }}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="faq" id="faq">
        <div className="section-topline reveal"><span>03 — أسئلة شائعة</span><span>FAQ</span></div>
        <div className="faq-layout">
          <div className="reveal">
            <h2>عندك <em>سؤال؟</em></h2>
            <p>جمعنا أكثر الأسئلة اللي بتوصلنا. إذا ما لقيت جوابك، ابعثلنا رسالة.</p>
            <a href="/contact" className="text-link">اسألنا مباشرة <ArrowLeft size={17} /></a>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div className={open ? "faq-item is-open reveal" : "faq-item reveal"} key={faq.q}>
                  <button type="button" onClick={() => setOpenFaq(open ? -1 : index)} aria-expanded={open}>
                    <span>{faq.q}</span><Plus size={20} />
                  </button>
                  <div className="faq-answer"><div><p>{faq.a}</p></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner title="جاهز تختار" accent="قطعتك؟" text="تصفّح المجموعة أو احكي معنا عن أي خدمة بتحتاجها." />
    </main>
  );
}
