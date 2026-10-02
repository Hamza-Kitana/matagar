import type { LucideIcon } from "lucide-react";
import { Gift, Handshake, Headphones, PackageSearch, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";

// Replace with the real Instagram account before publishing.
export const INSTAGRAM_HANDLE = "vybe";
export const INSTAGRAM_URL = "https://www.instagram.com/";

export const NAV_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/services", label: "الخدمات" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export type InfoCard = { icon: LucideIcon; title: string; text: string };

export const SERVICES: InfoCard[] = [
  { icon: PackageSearch, title: "طلب قطعة خاصة", text: "بدك إكسسوار مش موجود عنا؟ ابعثلنا صورة أو اسم القطعة وبندوّر عليها إلك." },
  { icon: Gift, title: "تغليف هدايا", text: "بنجهّز القطعة بتغليف مرتب مع كرت إهداء، جاهزة تفاجئ فيها حدا بتحبه." },
  { icon: Search, title: "مساعدة بالاختيار", text: "محتار بين لونين أو موديلين؟ احكيلنا شو بتستخدم وبنساعدك تختار الأنسب." },
  { icon: Sparkles, title: "باقات جاهزة", text: "تشكيلات مختارة من ساعة وسماعات وشاحن، بتلبق كهدية أو كبداية لستايلك." },
  { icon: Handshake, title: "طلبات بالجملة", text: "للشركات والمناسبات والمحلات؛ احكي معنا عن الكمية وبنرتب عرض خاص." },
  { icon: Truck, title: "ترتيب التوصيل", text: "بعد ما نأكد طلبك برسالة، بنتفق معك على طريقة وموعد التوصيل لمنطقتك." },
];

export const ORDER_STEPS = [
  { title: "اختار قطعتك", text: "تصفّح المنتجات واختار اللون والتفاصيل اللي بتناسبك." },
  { title: "ضيفها للسلة", text: "جمّع كل اللي عجبك بالسلة وانسخ الطلب بكبسة." },
  { title: "ابعثلنا رسالة", text: "الصق الطلب برسالة على إنستغرام، وبنرد عليك بالسعر والتوفر." },
  { title: "استلم وانبسط", text: "بنأكد معك التفاصيل وبنرتب التوصيل لعندك." },
];

export const VALUES: InfoCard[] = [
  { icon: ShieldCheck, title: "قطع مختارة", text: "ما بنعرض أي إشي؛ كل قطعة بنختارها لأنها بتستاهل تكون معك." },
  { icon: Sparkles, title: "الستايل أولاً", text: "الإكسسوار مش بس وظيفة، هو جزء من شخصيتك وطريقة لبسك." },
  { icon: Headphones, title: "قريبين منك", text: "بتحكي مع ناس حقيقيين بيردوا عليك وبيساعدوك من أول رسالة." },
  { icon: Truck, title: "تجربة سهلة", text: "من الاختيار للاستلام، كل خطوة واضحة وبدون تعقيد." },
];

export const FAQS = [
  { q: "كيف بعرف سعر القطعة؟", a: "ضيف القطعة للسلة وانسخ الطلب، وابعثه برسالة على إنستغرام. بنرد عليك بالسعر والتوفر بأسرع وقت." },
  { q: "هل بقدر أطلب لون أو موديل مش موجود بالموقع؟", a: "أكيد. استخدم خدمة طلب قطعة خاصة، ابعثلنا تفاصيل اللي بدك إياه وبنشوف إذا بنقدر نوفره." },
  { q: "كيف بيصير التوصيل؟", a: "بعد تأكيد الطلب برسالة، بنتفق معك على طريقة التوصيل وموعده حسب منطقتك." },
  { q: "بتعملوا تغليف هدايا؟", a: "نعم، احكيلنا إنها هدية وقت الطلب، وبنجهزها بتغليف مرتب مع كرت إهداء." },
  { q: "بقدر أطلب كميات للشركات أو المناسبات؟", a: "نعم، تواصل معنا بتفاصيل الكمية والمناسبة وبنرتب معك عرض خاص." },
];
