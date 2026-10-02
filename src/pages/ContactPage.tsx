import { useState, type FormEvent } from "react";
import { ArrowLeft, Check, Clock, HelpCircle, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageParts";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/data/site";
import { usePageTitle, useReveal } from "@/lib/useReveal";

const TOPICS = ["استفسار عن منتج", "طلب قطعة خاصة", "تغليف هدايا", "طلب بالجملة", "إشي تاني"];

export function ContactPage() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]!);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  usePageTitle("تواصل معنا — VYBE");
  useReveal();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = `مرحباً VYBE، معك ${name.trim()}.\nالموضوع: ${topic}\n${message.trim()}`;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <main>
      <PageHero index="05 / 05" eyebrow="خلينا نحكي" title="عندك سؤال؟" accent="إحنا هون." watermark="CONTACT" crumb="تواصل معنا"
        text="استفسار عن سعر، طلب خاص، أو بس بدك رأينا بقطعة؟ اكتب رسالتك هون وبنجهّزها إلك تبعثها على إنستغرام بكبسة." />

      <section className="contact-page">
        <div className="contact-grid">
          <div className="contact-cards">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="contact-card contact-card-main reveal">
              <Instagram size={28} strokeWidth={1.6} />
              <span className="small-label">راسلنا مباشرة</span>
              <strong>@{INSTAGRAM_HANDLE}</strong>
              <span className="contact-card-link">افتح إنستغرام <ArrowLeft size={16} /></span>
            </a>
            <div className="contact-card reveal">
              <Clock size={24} strokeWidth={1.6} />
              <strong>بنرد بأسرع وقت</strong>
              <p>كل رسالة بتوصلنا بنقرأها وبنرد عليها بنفسنا، مش رد آلي.</p>
            </div>
            <a href="/services#faq" className="contact-card reveal">
              <HelpCircle size={24} strokeWidth={1.6} />
              <strong>أسئلة شائعة</strong>
              <p>يمكن جواب سؤالك موجود. شوف الأسئلة اللي بتتكرر.</p>
            </a>
          </div>

          <form className="contact-form reveal" onSubmit={submit}>
            {status === "copied" ? (
              <div className="contact-success">
                <span className="contact-success-icon"><Check size={30} /></span>
                <h2>رسالتك جاهزة!</h2>
                <p>نسخناها إلك. افتح إنستغرام والصقها برسالة لحسابنا، وبنرد عليك قريباً.</p>
                <div className="contact-success-actions">
                  <Button asChild size="large"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={18} /> افتح إنستغرام</a></Button>
                  <button type="button" className="hero-ghost" onClick={() => setStatus("idle")}>عدّل الرسالة</button>
                </div>
              </div>
            ) : (
              <>
                <h2>ابعثلنا <em>رسالة.</em></h2>
                <label className="field">
                  <span>اسمك</span>
                  <input value={name} onChange={event => setName(event.target.value)} required autoComplete="name" placeholder="شو اسمك؟" />
                </label>
                <fieldset className="field">
                  <legend>الموضوع</legend>
                  <div className="pdp-pills">
                    {TOPICS.map(item => (
                      <button type="button" key={item} className={topic === item ? "pdp-pill is-active" : "pdp-pill"} onClick={() => setTopic(item)} aria-pressed={topic === item}>{item}</button>
                    ))}
                  </div>
                </fieldset>
                <label className="field">
                  <span>رسالتك</span>
                  <textarea value={message} onChange={event => setMessage(event.target.value)} required rows={5} placeholder="احكيلنا شو بدك…" />
                </label>
                <Button type="submit" size="large" className="contact-submit"><Send size={18} /> جهّز الرسالة وانسخها</Button>
                {status === "failed" && <p className="field-error" role="alert">ما قدرنا ننسخ تلقائياً. انسخ رسالتك يدوياً وابعثها على إنستغرام.</p>}
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
