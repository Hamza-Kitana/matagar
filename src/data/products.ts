import type { LucideIcon } from "lucide-react";
import {
  Activity, BatteryCharging, Bell, Bluetooth, Camera, Droplets, Gamepad2, Hand, Headphones, Heart, Lightbulb, Magnet, MapPin,
  Mic, Moon, Music, Package, Plane, Plug, RotateCcw, Shield, ShieldCheck, Smartphone, Sparkles, Speaker, Sun, Thermometer,
  Usb, Video, Volume2, Watch, Waves, Wrench, Zap,
} from "lucide-react";
import watchImage from "@/assets/smartwatch.jpg";
import earbudsImage from "@/assets/earbuds.jpg";
import chargerImage from "@/assets/charger.jpg";

// `swatch` is the real color; `tint` is a pale version multiplied over the product photo on its page.
export type OptionValue = { id: string; label: string; swatch?: string; tint?: string };
export type OptionGroup = { id: string; label: string; kind: "color" | "pill"; values: OptionValue[] };
export type Feature = { icon: LucideIcon; title: string; text: string };

export type CategoryId = "watches" | "audio" | "power" | "protection" | "speakers" | "gear";
export type Category = { id: CategoryId; name: string; english: string; blurb: string; icon: LucideIcon };

export type Product = {
  id: string;
  name: string;
  english: string;
  category: CategoryId;
  image: string;
  images: string[];
  alt: string;
  tag: string;
  number: string;
  tagline: string;
  description: string;
  options: OptionGroup[];
  features: Feature[];
  inBox: string[];
};

export const categories: Category[] = [
  { id: "watches", name: "ساعات ذكية", english: "SMART WATCHES", icon: Watch, blurb: "ساعات بتتابع يومك ونشاطك، وبتكمّل لبسك بكل مناسبة." },
  { id: "audio", name: "سماعات", english: "AUDIO", icon: Headphones, blurb: "من سماعات الأذن الصغيرة للهيدفونات الكبيرة؛ صوت بيشبهك." },
  { id: "power", name: "شواحن وباور بانك", english: "POWER", icon: Zap, blurb: "شحن سريع بالبيت، بالسيارة، وبالطريق. ما عاد في بطارية فاضية." },
  { id: "protection", name: "كفرات وحماية", english: "PROTECTION", icon: Shield, blurb: "كفرات ولاصقات بتحمي تلفونك وبتعطيه ستايل مختلف." },
  { id: "speakers", name: "سبيكرات", english: "SPEAKERS", icon: Speaker, blurb: "صوت بيعبّي الغرفة، الطلعة، والسهرة." },
  { id: "gear", name: "إكسسوارات ذكية", english: "SMART GEAR", icon: Sparkles, blurb: "ستاندات، إضاءة، وأدوات بتسهّل شغلك وتصويرك." },
];

const PALETTE = {
  black: { label: "أسود", swatch: "#1d1f21", tint: "#d4d7da" },
  midnight: { label: "ميدنايت", swatch: "#1f2326", tint: "#d5d9dc" },
  charcoal: { label: "فحمي", swatch: "#2a2c2e", tint: "#9ea2a6" },
  graphite: { label: "جرافيت", swatch: "#3b3f43", tint: "#bfc3c7" },
  silver: { label: "فضي", swatch: "#d7dadd", tint: "#f1f2f4" },
  white: { label: "أبيض", swatch: "#f4f4f2", tint: "#f2f2f0" },
  starlight: { label: "ستارلايت", swatch: "#e9dcc6", tint: "#f5e9d4" },
  sand: { label: "رملي", swatch: "#d8c3a0", tint: "#f1e7d6" },
  gold: { label: "ذهبي", swatch: "#e0c08a", tint: "#f3e4c6" },
  brown: { label: "بني", swatch: "#8a5a3b", tint: "#e8d5c6" },
  olive: { label: "زيتي", swatch: "#5a7a5c", tint: "#d6e6d1" },
  mint: { label: "نعناعي", swatch: "#9fe0c8", tint: "#dcf5ec" },
  lime: { label: "ليموني", swatch: "#c5fc62", tint: "#e4f9b6" },
  yellow: { label: "أصفر", swatch: "#f5d142", tint: "#fbf0bf" },
  orange: { label: "برتقالي", swatch: "#f28c38", tint: "#fbd9b8" },
  red: { label: "أحمر", swatch: "#d94040", tint: "#f5c9c9" },
  rose: { label: "وردي", swatch: "#f0aebd", tint: "#f8d9e0" },
  purple: { label: "بنفسجي", swatch: "#8a6cd6", tint: "#ddd3f5" },
  sky: { label: "سماوي", swatch: "#8ec9f0", tint: "#d9eefb" },
  blue: { label: "أزرق", swatch: "#3d6fd6", tint: "#cfdcf6" },
  navy: { label: "كحلي", swatch: "#1f2f4f", tint: "#c3cad8" },
  clear: { label: "شفاف", swatch: "#e8eef2", tint: "#f6f8fa" },
} satisfies Record<string, Omit<OptionValue, "id">>;

type ColorId = keyof typeof PALETTE;

const pills = (id: string, label: string, values: string[]): OptionGroup =>
  ({ id, label, kind: "pill", values: values.map((value, index) => ({ id: `${id}-${index + 1}`, label: value })) });

const SIZE = pills("size", "المقاس", ["41 ملم", "45 ملم"]);
const AIRPODS_CASE = pills("case", "الكفر", ["بدون كفر", "كفر سيليكون", "كفر شفاف"]);
const CABLE = pills("cable", "الكيبل", ["بدون كيبل", "كيبل 1 متر", "كيبل 2 متر"]);
const PHONE_MODEL = pills("model", "موديل التلفون", ["آيفون 15", "آيفون 15 برو", "آيفون 16", "آيفون 16 برو", "سامسونج S24"]);
const BUNDLE = pills("bundle", "الباقة", ["السبيكر لحاله", "مع شنطة حمل"]);

const DEFAULTS: Record<CategoryId, { choices: OptionGroup[]; features: Feature[]; inBox: string[] }> = {
  watches: {
    choices: [SIZE],
    features: [
      { icon: Activity, title: "تتبّع النشاط", text: "خطواتك، السعرات، ونبضك بنظرة وحدة." },
      { icon: Bell, title: "إشعارات فورية", text: "رسائل ومكالمات بدون ما تطلّع التلفون." },
      { icon: Moon, title: "متابعة النوم", text: "اعرف كيف نمت وشو بتحتاج تعدّل." },
      { icon: Droplets, title: "ضد العرق والرذاذ", text: "مريحة بالتمرين وبكل يومك." },
    ],
    inBox: ["الساعة", "سوار", "شاحن مغناطيسي", "دليل الاستخدام"],
  },
  audio: {
    choices: [AIRPODS_CASE],
    features: [
      { icon: Music, title: "صوت نقي", text: "تفاصيل واضحة وباس بتحسّه." },
      { icon: Mic, title: "مايك للمكالمات", text: "صوتك بيوصل واضح وإنت ماشي." },
      { icon: BatteryCharging, title: "بطارية طويلة", text: "ساعات استماع بشحنة وحدة." },
      { icon: Bluetooth, title: "اقتران سريع", text: "بتتصل بتلفونك من أول مرة." },
    ],
    inBox: ["السماعة", "كيبل شحن", "دليل الاستخدام"],
  },
  power: {
    choices: [CABLE],
    features: [
      { icon: Zap, title: "شحن سريع", text: "نص البطارية بدقائق معدودة." },
      { icon: ShieldCheck, title: "حماية ذكية", text: "حماية من الحرارة والشحن الزايد." },
      { icon: Plug, title: "متوافق مع كل شي", text: "آيفون، أندرويد، سماعات وساعات." },
      { icon: Plane, title: "خفيف للسفر", text: "بيفوت بالشنطة وبالجيبة." },
    ],
    inBox: ["الشاحن", "كيبل حسب اختيارك", "دليل الاستخدام"],
  },
  protection: {
    choices: [PHONE_MODEL],
    features: [
      { icon: Shield, title: "حماية من الوقعات", text: "زوايا مقوّاة بتمتص الصدمة." },
      { icon: Hand, title: "مسكة مريحة", text: "ما بتزحلق من إيدك." },
      { icon: Camera, title: "حماية الكاميرا", text: "حواف مرفوعة حوالين العدسات." },
      { icon: Magnet, title: "يدعم الشحن اللاسلكي", text: "اشحن بدون ما تشيل الكفر." },
    ],
    inBox: ["الكفر", "قطعة تنظيف"],
  },
  speakers: {
    choices: [BUNDLE],
    features: [
      { icon: Volume2, title: "صوت عالي ونقي", text: "بيعبّي المكان بدون تشويش." },
      { icon: Waves, title: "باس عميق", text: "بتحس الإيقاع مش بس بتسمعه." },
      { icon: BatteryCharging, title: "ساعات تشغيل", text: "سهرة كاملة بشحنة وحدة." },
      { icon: Bluetooth, title: "بلوتوث ثابت", text: "اتصال قوي حتى من بعيد." },
    ],
    inBox: ["السبيكر", "كيبل شحن", "دليل الاستخدام"],
  },
  gear: {
    choices: [],
    features: [
      { icon: Sparkles, title: "تصميم أنيق", text: "قطعة بتزيّن مكتبك أو سيارتك." },
      { icon: Smartphone, title: "متوافق مع تلفونك", text: "بيشتغل مع آيفون وأندرويد." },
      { icon: Wrench, title: "تركيب سهل", text: "جاهز للاستخدام بثواني." },
      { icon: Package, title: "خفيف ومحمول", text: "خذه معك وين ما رحت." },
    ],
    inBox: ["القطعة", "دليل الاستخدام"],
  },
};

type Seed = {
  id: string;
  name: string;
  english: string;
  tag: string;
  tagline: string;
  description: string;
  colors: ColorId[];
  choices?: OptionGroup[];
  features?: Feature[];
  inBox?: string[];
  image?: string;
  gallery?: string[];
  alt?: string;
};

const CATALOG: Record<CategoryId, Seed[]> = {
  watches: [
    {
      id: "watch", name: "ساعة سمارت", english: "SMART WATCH", tag: "الأكثر طلباً", image: watchImage, alt: "ساعة ذكية سوداء بشاشة ملونة",
      tagline: "وقتك، نشاطك، وإشعاراتك… كلها على إيدك.",
      description: "ساعة ذكية بتصميم نظيف وشاشة ملونة واضحة، بتتابع خطواتك ونبضك ونومك، وبتوصلك إشعارات تلفونك أول بأول. بتلبق على الجيم، الشغل، والطلعات.",
      colors: ["midnight", "silver", "starlight", "olive"],
      choices: [SIZE, pills("strap", "نوع السوار", ["سيليكون رياضي", "جلد", "ستانلس ستيل"])],
      inBox: ["الساعة", "سوار حسب اختيارك", "شاحن مغناطيسي", "دليل الاستخدام"],
    },
    {
      id: "watch-ultra", name: "ساعة ألترا", english: "ULTRA WATCH", tag: "للمغامرين",
      tagline: "قوية بقدّ مغامرتك.",
      description: "هيكل تيتانيوم وشاشة كبيرة بتنقرا تحت الشمس، مع بطارية بتكفّي أيام. معمولة للهايكنج، السباحة، والرياضات الصعبة.",
      colors: ["orange", "black", "olive"], choices: [pills("size", "المقاس", ["49 ملم"]), pills("strap", "نوع السوار", ["ألباين", "تريل", "أوشن"])],
    },
    {
      id: "watch-classic", name: "ساعة هايبرد كلاسيك", english: "CLASSIC HYBRID", tag: "أناقة",
      tagline: "شكل كلاسيكي وعقل ذكي.",
      description: "عقارب حقيقية وشاشة صغيرة مخفية بتعرض الإشعارات والخطوات. بتلبق على البدلة وعلى الجينز، وبطاريتها بتطول أسابيع.",
      colors: ["brown", "black", "sand"], choices: [pills("size", "المقاس", ["40 ملم", "44 ملم"]), pills("strap", "نوع السوار", ["جلد", "ميلانيز"])],
    },
    {
      id: "watch-round", name: "ساعة دائرية", english: "ROUND SMART", tag: "جديد",
      tagline: "شاشة دائرية بلمسة فخمة.",
      description: "ساعة ذكية بشاشة AMOLED دائرية وإطار معدني، فيها أوضاع رياضية كثيرة ومتابعة للنبض والأكسجين.",
      colors: ["black", "silver", "gold"], choices: [pills("size", "المقاس", ["42 ملم", "46 ملم"])],
    },
    {
      id: "fitness-band", name: "سوار رياضي", english: "FITNESS BAND", tag: "خفيف",
      tagline: "خفيف لدرجة بتنسى إنك لابسه.",
      description: "سوار نحيف بيتابع خطواتك ونومك ونبضك، بشاشة واضحة وبطارية بتعيش لأسبوعين. أحلى بداية لعالم الساعات الذكية.",
      colors: ["black", "lime", "rose", "sky"], choices: [],
      inBox: ["السوار", "شاحن", "دليل الاستخدام"],
    },
    {
      id: "watch-kids", name: "ساعة أطفال ذكية", english: "KIDS WATCH", tag: "للعيلة",
      tagline: "راحة بال إلك، ولعبة حلوة إلهم.",
      description: "ساعة ملونة للأطفال فيها مكالمات للأرقام المحفوظة بس، وتحديد موقع، وتذكيرات يومية. خفيفة ومريحة على الإيد الصغيرة.",
      colors: ["rose", "sky", "lime"], choices: [],
      features: [
        { icon: MapPin, title: "تحديد الموقع", text: "اعرف وين ولادك من تلفونك." },
        { icon: Bell, title: "مكالمات آمنة", text: "بس للأرقام اللي إنت بتحفظها." },
        { icon: Heart, title: "مريحة وخفيفة", text: "سوار ناعم على الجلد." },
        { icon: Droplets, title: "ضد الرذاذ", text: "ما بتخاف من المي واللعب." },
      ],
    },
    {
      id: "watch-sport", name: "ساعة GPS رياضية", english: "GPS SPORT", tag: "للرياضيين",
      tagline: "كل كيلومتر محسوب.",
      description: "GPS مدمج بيسجّل مسارك وسرعتك بدون تلفون، مع خطط تمرين ومتابعة للتعافي. للركض، البسكليت، والجبال.",
      colors: ["black", "olive", "navy"],
      features: [
        { icon: MapPin, title: "GPS مدمج", text: "سجّل مسارك بدون تلفون." },
        { icon: Activity, title: "تحليل التمرين", text: "سرعة، نبض، ومستوى التعب." },
        { icon: Sun, title: "شاشة تحت الشمس", text: "واضحة حتى بعز الضو." },
        { icon: Droplets, title: "ضد الماء", text: "جاهزة للسباحة." },
      ],
    },
    {
      id: "watch-mini", name: "ساعة ميني", english: "MINI WATCH", tag: "ناعمة",
      tagline: "صغيرة وذكية ومرتّبة.",
      description: "حجم ألطف للمعاصم الرفيعة، بنفس المميزات الذكية: إشعارات، نشاط، ونوم. تصميم ناعم بيلبق مع كل شي.",
      colors: ["white", "starlight", "rose"], choices: [pills("size", "المقاس", ["38 ملم", "40 ملم"])],
    },
    {
      id: "watch-strap", name: "سوار ساعة بديل", english: "WATCH STRAP", tag: "غيّر ستايلك",
      tagline: "ساعة وحدة، ستايل جديد كل يوم.",
      description: "أساور بديلة بتركب بثانية على ساعتك. اختار الخامة واللون اللي بيلبق مع لبسك، وبدّل حسب المزاج.",
      colors: ["olive", "black", "orange", "sand", "navy"],
      choices: [pills("size", "المقاس", ["38-41 ملم", "42-49 ملم"]), pills("material", "الخامة", ["سيليكون", "جلد", "نايلون", "ستانلس ستيل"])],
      features: [
        { icon: RotateCcw, title: "تبديل بثانية", text: "كبسة وحدة وبتغيّره." },
        { icon: Heart, title: "مريح طول اليوم", text: "خامات ناعمة على الجلد." },
        { icon: Sparkles, title: "ألوان كثيرة", text: "لكل لبسة سوار." },
        { icon: Droplets, title: "ضد العرق", text: "مناسب للتمرين." },
      ],
      inBox: ["السوار", "أداة التركيب"],
    },
    {
      id: "watch-dock", name: "ستاند شحن للساعة", english: "WATCH DOCK", tag: "ترتيب",
      tagline: "مكان أنيق لساعتك بالليل.",
      description: "ستاند صغير بيشحن ساعتك وهي واقفة، وبتتحول لساعة منبّه جنب السرير. خامة معدنية بتزيّن الكومودينة.",
      colors: ["silver", "white", "graphite"], choices: [],
      features: [
        { icon: Zap, title: "شحن سريع", text: "ساعتك جاهزة الصبح." },
        { icon: Moon, title: "وضع المنبّه", text: "بتصير ساعة كومودينة." },
        { icon: Sparkles, title: "خامة معدنية", text: "قطعة بتزيّن المكان." },
        { icon: ShieldCheck, title: "حماية ذكية", text: "من الحرارة والشحن الزايد." },
      ],
      inBox: ["الستاند", "كيبل USB-C", "دليل الاستخدام"],
    },
  ],
  audio: [
    {
      id: "earbuds", name: "سماعات وايرلس", english: "WIRELESS AUDIO", tag: "صوت مختلف", image: earbudsImage, alt: "سماعات لاسلكية بيضاء مع علبة الشحن",
      tagline: "صوتك المفضّل، بدون ولا سلك.",
      description: "سماعات لاسلكية خفيفة بتقعد مرتاحة بالأذن، صوتها نقي والباس واضح، ومعها علبة شحن صغيرة بتفوت بأي جيبة. اقتران سريع مع تلفونك من أول مرة.",
      colors: ["white", "charcoal", "lime", "rose"],
      features: [
        { icon: Music, title: "صوت نقي", text: "تفاصيل واضحة وباس بتحسّه." },
        { icon: Mic, title: "مايك للمكالمات", text: "صوتك بيوصل واضح وإنت ماشي." },
        { icon: BatteryCharging, title: "علبة شحن", text: "صغيرة وبتشحن السماعات وإنت متنقّل." },
        { icon: Bluetooth, title: "اقتران سريع", text: "افتح العلبة وبتتصل لحالها." },
      ],
      inBox: ["السماعتين", "علبة الشحن", "رؤوس سيليكون بمقاسات", "كيبل شحن"],
    },
    {
      id: "earbuds-pro", name: "سماعات برو بعزل ضوضاء", english: "PRO ANC", tag: "الأكثر طلباً",
      tagline: "كبسة وحدة والعالم بيسكت.",
      description: "عزل ضوضاء نشط بيخليك بعالمك بالمواصلات والمكتب، ووضع شفافية لما بدك تسمع اللي حواليك. صوت محيطي وتحكم باللمس.",
      colors: ["white", "black"],
      inBox: ["السماعتين", "علبة شحن لاسلكي", "رؤوس بثلاث مقاسات", "كيبل USB-C"],
    },
    {
      id: "headphones", name: "هيدفون لاسلكي", english: "OVER-EAR", tag: "راحة",
      tagline: "ساعات استماع بدون تعب.",
      description: "هيدفون كبير بوسائد ناعمة وعزل ممتاز، بطاريته بتطول لأكثر من 30 ساعة وبيتطوى بشنطته الصغيرة.",
      colors: ["black", "white", "sand", "navy"], choices: [pills("case", "الإضافات", ["بدون شنطة", "مع شنطة حمل"])],
    },
    {
      id: "headphones-studio", name: "هيدفون ستوديو", english: "STUDIO", tag: "للمحترفين",
      tagline: "اسمع كل تفصيلة متل ما انعملت.",
      description: "هيدفون سلكي بصوت محايد ودقيق، مثالي للمونتاج، الموسيقى، والبودكاست. كيبل قابل للفصل وتصميم متين.",
      colors: ["black", "silver"], choices: [pills("cable", "الكيبل", ["كيبل 1.2 متر", "كيبل لولبي 3 متر"])],
      inBox: ["الهيدفون", "كيبل حسب اختيارك", "محوّل 6.3 ملم", "شنطة قماش"],
    },
    {
      id: "sport-earbuds", name: "سماعات رياضية", english: "SPORT BUDS", tag: "للجيم",
      tagline: "بتضل مكانها مهما تحركت.",
      description: "سماعات بخطّافات مرنة حوالين الأذن، ضد العرق والمي، وصوتها قوي يشجعك تكمّل آخر جولة بالتمرين.",
      colors: ["black", "lime", "sky"], choices: [],
      inBox: ["السماعتين", "علبة الشحن", "رؤوس سيليكون", "كيبل شحن"],
    },
    {
      id: "neckband", name: "سماعة رقبة", english: "NECKBAND", tag: "عملية",
      tagline: "دايماً جاهزة على رقبتك.",
      description: "سماعة بتلتف حوالين الرقبة ورؤوسها مغناطيسية بتلزق ببعض لما ما تستخدمها. خفيفة وبطاريتها طويلة.",
      colors: ["black", "navy", "red"], choices: [],
    },
    {
      id: "gaming-headset", name: "هيدسيت جيمنج", english: "GAMING HEADSET", tag: "للجيمرز",
      tagline: "اسمع خطوات الخصم قبل ما يشوفك.",
      description: "صوت محيطي 7.1 ومايك بيلغي الضجة، مع إضاءة RGB ووسائد مريحة لساعات لعب طويلة. بيشتغل على البلايستيشن والكمبيوتر والموبايل.",
      colors: ["black", "white"], choices: [pills("connection", "طريقة الاتصال", ["سلكي USB", "لاسلكي"])],
      features: [
        { icon: Gamepad2, title: "صوت محيطي", text: "حدد اتجاه كل صوت باللعبة." },
        { icon: Mic, title: "مايك واضح", text: "بيلغي الضجة حواليك." },
        { icon: Lightbulb, title: "إضاءة RGB", text: "ألوان بتلبق على سيت أبك." },
        { icon: Heart, title: "راحة طويلة", text: "وسائد ميموري فوم." },
      ],
    },
    {
      id: "wired-earphones", name: "سماعات سلكية", english: "WIRED", tag: "بسيطة",
      tagline: "وصّل واسمع، بدون شحن.",
      description: "سماعات سلكية بصوت نظيف ومايك وأزرار تحكم على الكيبل. اختار المنفذ المناسب لتلفونك.",
      colors: ["white", "black"], choices: [pills("plug", "المنفذ", ["USB-C", "لايتنينج", "3.5 ملم"])],
      inBox: ["السماعة", "رؤوس سيليكون"],
    },
    {
      id: "kids-headphones", name: "هيدفون أطفال", english: "KIDS", tag: "آمنة",
      tagline: "صوت محدود يحمي أذنهم.",
      description: "هيدفون خفيف بألوان مرحة وصوت محدود بحد آمن للأطفال. وسائد ناعمة وتصميم بيتحمّل الوقعات.",
      colors: ["rose", "sky", "mint", "yellow"], choices: [],
    },
    {
      id: "earbuds-case", name: "كفر علبة السماعات", english: "CASE COVER", tag: "حماية",
      tagline: "علبتك نظيفة ومحمية.",
      description: "كفر سيليكون ناعم لعلبة السماعات مع علاقة مفاتيح. بيحمي من الخدوش والوقعات وبيعطيها لون على ذوقك.",
      colors: ["black", "lime", "rose", "orange", "clear"], choices: [pills("model", "الموديل", ["AirPods 3", "AirPods 4", "AirPods Pro 2"])],
      features: [
        { icon: Shield, title: "ضد الخدوش", text: "سيليكون بيمتص الوقعات." },
        { icon: Zap, title: "يدعم الشحن", text: "اشحن بدون ما تشيله." },
        { icon: Sparkles, title: "ألوان حلوة", text: "غيّر شكل علبتك." },
        { icon: Package, title: "علاقة مفاتيح", text: "علّقها على شنطتك." },
      ],
      inBox: ["الكفر", "علاقة معدنية"],
    },
  ],
  power: [
    {
      id: "charger", name: "شاحن مغناطيسي", english: "MAGNETIC CHARGER", tag: "تفاصيل تفرق", image: chargerImage, alt: "حامل شحن مغناطيسي فضي يحمل هاتفاً",
      tagline: "حطّه… بيلقط وبيشحن.",
      description: "ستاند شحن مغناطيسي بتصميم معدني أنيق. بتقرّب التلفون وبيثبت مكانه، وبتقدر تعدّل الزاوية عشان تشوف الشاشة وهو بيشحن على المكتب أو جنب السرير.",
      colors: ["silver", "graphite", "gold"], choices: [pills("cable", "طول الكيبل", ["1 متر", "2 متر"])],
      features: [
        { icon: Magnet, title: "تثبيت مغناطيسي", text: "بيلقط التلفون بمكانه الصح فوراً." },
        { icon: Zap, title: "شحن لاسلكي", text: "بدون ما تدوّر على الكيبل كل مرة." },
        { icon: RotateCcw, title: "زاوية مرنة", text: "عدّل الزاوية على راحتك." },
        { icon: Sparkles, title: "تصميم معدني", text: "قطعة بتزيّن مكتبك." },
      ],
      inBox: ["الستاند", "كيبل حسب اختيارك", "دليل الاستخدام"],
    },
    {
      id: "fast-charger", name: "راس شاحن سريع GaN", english: "GaN 65W", tag: "الأكثر طلباً",
      tagline: "صغير بالحجم، جبار بالقوة.",
      description: "تقنية GaN بقوة 65 واط بتشحن اللابتوب والتلفون مع بعض، بحجم أصغر من الشاحن العادي. أحلى رفيق سفر.",
      colors: ["black", "white"], choices: [pills("power", "القوة", ["30 واط", "65 واط", "100 واط"]), CABLE],
    },
    {
      id: "powerbank", name: "باور بانك 20000", english: "POWER BANK 20K", tag: "للسفر",
      tagline: "شحن كامل لأيام، وين ما كنت.",
      description: "باور بانك بسعة 20000 ملي أمبير بيشحن تلفونك أكثر من 4 مرات، مع منفذين وشاشة بتبين النسبة الباقية.",
      colors: ["black", "white", "navy"], choices: [pills("capacity", "السعة", ["10000 mAh", "20000 mAh"])],
      inBox: ["الباور بانك", "كيبل USB-C", "دليل الاستخدام"],
    },
    {
      id: "magsafe-battery", name: "باور بانك مغناطيسي", english: "MAG BATTERY", tag: "ترند",
      tagline: "بيلزق ورا تلفونك وبيشحن.",
      description: "بطارية نحيفة مغناطيسية بتلزق على ظهر التلفون وبتشحنه لاسلكياً وإنت بتستخدمه. بدون كيابل ولا لخبطة.",
      colors: ["lime", "white", "black", "purple"], choices: [pills("capacity", "السعة", ["5000 mAh", "10000 mAh"])],
      inBox: ["البطارية", "كيبل USB-C"],
    },
    {
      id: "wireless-pad", name: "قاعدة شحن لاسلكي", english: "WIRELESS PAD", tag: "بسيطة",
      tagline: "حطّه واتركه يشحن.",
      description: "قاعدة دائرية نحيفة بتشحن التلفون والسماعات لاسلكياً، بإضاءة هادية ما بتزعجك بالليل.",
      colors: ["white", "black", "sand"],
    },
    {
      id: "charging-station", name: "محطة شحن 3 في 1", english: "3-IN-1 STATION", tag: "ترتيب",
      tagline: "تلفونك، ساعتك، وسماعاتك… بمكان واحد.",
      description: "محطة وحدة بتشحن التلفون والساعة والسماعات مع بعض، وبتنهي فوضى الكيابل على المكتب أو جنب السرير.",
      colors: ["white", "black", "graphite"], choices: [],
      inBox: ["المحطة", "راس شاحن", "كيبل USB-C"],
    },
    {
      id: "usb-c-cable", name: "كيبل مجدول", english: "BRAIDED CABLE", tag: "قوي",
      tagline: "كيبل ما بينقطع.",
      description: "كيبل بغلاف نايلون مجدول بيتحمل آلاف الثنيات، بيدعم الشحن السريع ونقل البيانات بسرعة عالية.",
      colors: ["orange", "black", "white", "lime"],
      choices: [pills("type", "النوع", ["USB-C إلى USB-C", "USB-C إلى لايتنينج"]), pills("length", "الطول", ["1 متر", "2 متر", "3 متر"])],
      features: [
        { icon: Shield, title: "مجدول ومتين", text: "بيتحمّل الشد والثني." },
        { icon: Zap, title: "شحن سريع", text: "لحد 100 واط." },
        { icon: Usb, title: "نقل بيانات", text: "سرعة عالية للملفات." },
        { icon: Sparkles, title: "ألوان حلوة", text: "بتلاقيه بسرعة بالشنطة." },
      ],
      inBox: ["الكيبل", "رابط ترتيب"],
    },
    {
      id: "car-charger", name: "شاحن سيارة", english: "CAR CHARGER", tag: "للطريق",
      tagline: "اوصل وبطاريتك مليانة.",
      description: "شاحن سيارة صغير بمنفذين USB-C وUSB-A، بيشحن جهازين مع بعض بسرعة عالية وبيختفي تقريباً بالسيارة.",
      colors: ["black", "silver"],
    },
    {
      id: "multi-charger", name: "شاحن متعدد المنافذ", english: "MULTI-PORT", tag: "للعيلة",
      tagline: "راس واحد لكل أجهزة البيت.",
      description: "شاحن بأربع منافذ بيشحن التلفونات والتابلت والسماعات مع بعض، مع توزيع ذكي للقوة على كل جهاز.",
      colors: ["white", "black"],
    },
    {
      id: "solar-bank", name: "محطة طاقة شمسية", english: "SOLAR STATION", tag: "للرحلات",
      tagline: "كهربا من الشمس بنص البرية.",
      description: "محطة طاقة محمولة مع لوح شمسي قابل للطي، بتشحن التلفونات واللابتوب والإضاءة بالرحلات والتخييم.",
      colors: ["orange", "graphite"], choices: [pills("bundle", "الباقة", ["المحطة لحالها", "مع لوح شمسي"])],
      features: [
        { icon: Sun, title: "شحن بالشمس", text: "لوح قابل للطي بيشحنها." },
        { icon: Plug, title: "منافذ كثيرة", text: "USB وكهربا عادية." },
        { icon: Thermometer, title: "بتتحمل الجو", text: "مصممة للبرّا." },
        { icon: Plane, title: "سهلة الحمل", text: "مسكة قوية للرحلات." },
      ],
      inBox: ["المحطة", "كيبل شحن", "اللوح حسب الباقة"],
    },
  ],
  protection: [
    {
      id: "silicone-case", name: "كفر سيليكون", english: "SILICONE CASE", tag: "الأكثر طلباً",
      tagline: "ناعم بالإيد، قوي بالوقعة.",
      description: "كفر سيليكون بملمس مخملي وبطانة ناعمة من جوا، بيحمي تلفونك من الخدوش والوقعات اليومية وبيجي بألوان كثيرة.",
      colors: ["black", "lime", "rose", "sky", "orange"],
    },
    {
      id: "clear-case", name: "كفر شفاف", english: "CLEAR CASE", tag: "ما بيصفّر",
      tagline: "خلّي لون تلفونك يبين.",
      description: "كفر شفاف تماماً بمادة ما بتصفّر مع الوقت، وزوايا مقوّاة بتمتص الصدمات.",
      colors: ["clear", "black", "purple"],
    },
    {
      id: "leather-case", name: "كفر جلد", english: "LEATHER CASE", tag: "فخامة",
      tagline: "جلد بيحلى مع الأيام.",
      description: "كفر من الجلد الطبيعي بيكتسب طابع خاص مع الاستخدام، بأزرار معدنية ودعم للشحن المغناطيسي.",
      colors: ["brown", "navy", "black", "sand"],
    },
    {
      id: "wallet-case", name: "كفر محفظة", english: "WALLET CASE", tag: "عملي",
      tagline: "تلفونك ومحفظتك بقطعة وحدة.",
      description: "كفر فيه جيبة للبطاقات والمصاري وعلاقة للكتف، عشان تطلع بتلفونك بس وما تحمل همّ شي ثاني.",
      colors: ["black", "brown", "rose"],
      inBox: ["الكفر", "علاقة كتف"],
    },
    {
      id: "rugged-case", name: "كفر ضد الصدمات", english: "RUGGED", tag: "حماية قصوى",
      tagline: "معمول للوقعات الصعبة.",
      description: "طبقتين حماية وحواف مرفوعة للشاشة والكاميرا، بيتحمل الوقوع من مترين. للشغل الصعب والمغامرات.",
      colors: ["black", "olive", "navy"],
    },
    {
      id: "screen-protector", name: "لاصقة شاشة زجاج", english: "GLASS GUARD", tag: "ضروري",
      tagline: "شاشتك بأمان من أول يوم.",
      description: "زجاج مقوّى 9H بيحمي الشاشة من الخدوش والكسر، شفاف تماماً وما بيأثر على اللمس. معه إطار بيسهّل التركيب بدون فقاعات.",
      colors: ["clear", "black"], choices: [PHONE_MODEL, pills("type", "النوع", ["شفاف", "مطفي", "خصوصية"])],
      features: [
        { icon: Shield, title: "صلابة 9H", text: "بيحمي من الخدوش والكسر." },
        { icon: Smartphone, title: "لمس سلس", text: "حساسية متل الشاشة الأصلية." },
        { icon: Wrench, title: "تركيب سهل", text: "إطار بيضبطه بمكانه." },
        { icon: Droplets, title: "ضد البصمات", text: "طبقة بتصد الزيوت." },
      ],
      inBox: ["قطعتين زجاج", "إطار تركيب", "مناديل تنظيف"],
    },
    {
      id: "camera-protector", name: "حماية الكاميرا", english: "LENS GUARD", tag: "تفصيلة مهمة",
      tagline: "عدساتك بدون ولا خدش.",
      description: "حلقات زجاج وألمنيوم لكل عدسة، بتحمي الكاميرا بدون ما تأثر على جودة الصور أو الفلاش.",
      colors: ["silver", "black", "gold", "purple"],
      features: [
        { icon: Camera, title: "صور بنفس الجودة", text: "زجاج شفاف ما بيعكس." },
        { icon: Shield, title: "ضد الخدوش", text: "حماية لكل عدسة لحال." },
        { icon: Sparkles, title: "لمسة معدنية", text: "بتزيّن ظهر التلفون." },
        { icon: Wrench, title: "تركيب سهل", text: "بتلزق بثانية." },
      ],
      inBox: ["حماية العدسات", "مناديل تنظيف"],
    },
    {
      id: "phone-strap", name: "علاقة موبايل", english: "PHONE STRAP", tag: "ترند",
      tagline: "تلفونك على كتفك ستايل.",
      description: "علاقة قماش أو خرز بتركب على أي كفر، بتخليك تحمل تلفونك على الكتف أو المعصم وتعطيه لمسة شخصية.",
      colors: ["black", "rose", "lime", "sand"], choices: [pills("type", "النوع", ["كتف طويلة", "معصم قصيرة", "خرز ملون"])],
      features: [
        { icon: Hand, title: "إيديك فاضيين", text: "التلفون عليك دايماً." },
        { icon: Sparkles, title: "لمسة شخصية", text: "ألوان وخامات كثيرة." },
        { icon: Smartphone, title: "لكل التلفونات", text: "بتركب على أي كفر." },
        { icon: Shield, title: "متينة", text: "قماش وعقد قوية." },
      ],
      inBox: ["العلاقة", "قطعة التركيب"],
    },
    {
      id: "tablet-case", name: "كفر تابلت بكيبورد", english: "TABLET CASE", tag: "للشغل",
      tagline: "حوّل التابلت للابتوب.",
      description: "كفر بيحمي التابلت مع كيبورد لاسلكي قابل للفصل وستاند بزوايا مختلفة. للدراسة والشغل والسفر.",
      colors: ["black", "navy", "graphite"], choices: [pills("model", "الموديل", ["آيباد 10.9", "آيباد إير 11", "آيباد برو 13"])],
      inBox: ["الكفر", "الكيبورد", "كيبل شحن"],
    },
    {
      id: "pop-grip", name: "جريب خلفي", english: "GRIP", tag: "هدية حلوة",
      tagline: "مسكة أقوى وستاند صغير.",
      description: "جريب بيلزق ورا التلفون، بيعطيك مسكة ثابتة للسيلفي وبيتحول لستاند صغير لما تتفرج على فيديو.",
      colors: ["lime", "black", "rose", "clear"], choices: [pills("type", "النوع", ["لاصق", "مغناطيسي"])],
      features: [
        { icon: Hand, title: "مسكة ثابتة", text: "التلفون ما بيوقع من إيدك." },
        { icon: Video, title: "ستاند للفيديو", text: "افتحه وتفرّج براحتك." },
        { icon: Magnet, title: "نسخة مغناطيسية", text: "بتشيله وبترجعه بثانية." },
        { icon: Sparkles, title: "ألوان مرحة", text: "لمسة على ذوقك." },
      ],
      inBox: ["الجريب", "قاعدة لاصقة احتياط"],
    },
  ],
  speakers: [
    {
      id: "speaker-mini", name: "سبيكر ميني", english: "MINI SPEAKER", tag: "الأكثر طلباً",
      tagline: "صغير بالجيبة، كبير بالصوت.",
      description: "سبيكر بلوتوث صغير بصوت 360 درجة، بيعلق على الشنطة وبيرافقك على البحر والجامعة والطلعات.",
      colors: ["black", "lime", "sky", "red"],
    },
    {
      id: "speaker-party", name: "سبيكر بارتي", english: "PARTY SPEAKER", tag: "للسهرات",
      tagline: "السهرة بتبلّش لما يشتغل.",
      description: "سبيكر كبير بباس قوي وإضاءة بتتحرك مع الإيقاع، بتقدر تربط معه سبيكر ثاني وتعمل صوت ستيريو.",
      colors: ["black", "red"],
      features: [
        { icon: Volume2, title: "صوت جبار", text: "بيعبّي حديقة كاملة." },
        { icon: Lightbulb, title: "إضاءة مع الإيقاع", text: "أضواء بتتراقص مع الموسيقى." },
        { icon: Waves, title: "باس عميق", text: "بتحسه بصدرك." },
        { icon: BatteryCharging, title: "12 ساعة تشغيل", text: "للسهرة كلها." },
      ],
    },
    {
      id: "speaker-waterproof", name: "سبيكر ضد الماء", english: "WATERPROOF", tag: "للبحر",
      tagline: "خذه للمسبح بدون خوف.",
      description: "سبيكر بحماية IP67 ضد الماء والغبار، بيطوف على المي وبيتحمل الرمل. رفيقك المثالي بالصيف.",
      colors: ["silver", "sky", "mint", "black"],
      features: [
        { icon: Droplets, title: "حماية IP67", text: "بيتحمل الغطس والرذاذ." },
        { icon: Sun, title: "للصيف والبحر", text: "ما بيتأثر بالرمل." },
        { icon: Volume2, title: "صوت صافي", text: "واضح حتى برّا." },
        { icon: BatteryCharging, title: "بطارية طويلة", text: "يوم بحر كامل." },
      ],
    },
    {
      id: "smart-speaker", name: "سبيكر ذكي", english: "SMART SPEAKER", tag: "بيتك أذكى",
      tagline: "احكيله وبيشغّل.",
      description: "سبيكر ذكي بمساعد صوتي، بيشغّل موسيقاك، بيجاوب أسئلتك، وبيتحكم بالأجهزة الذكية بالبيت.",
      colors: ["charcoal", "white", "sand"], choices: [],
      features: [
        { icon: Mic, title: "أوامر صوتية", text: "شغّل وأطفي بصوتك." },
        { icon: Lightbulb, title: "بيت ذكي", text: "تحكم بالإضاءة والأجهزة." },
        { icon: Music, title: "صوت غني", text: "بيعبّي الغرفة." },
        { icon: Bluetooth, title: "واي فاي وبلوتوث", text: "اتصال من أي جهاز." },
      ],
      inBox: ["السبيكر", "محوّل كهربا", "دليل الاستخدام"],
    },
    {
      id: "soundbar", name: "ساوند بار", english: "SOUNDBAR", tag: "سينما بالبيت",
      tagline: "حوّل صالونك لسينما.",
      description: "ساوند بار نحيف بصوت محيطي وحوار أوضح، بيتصل بالتلفزيون بكيبل واحد أو بلوتوث.",
      colors: ["black", "white"], choices: [pills("bundle", "الباقة", ["الساوند بار لحاله", "مع سبووفر"])],
      inBox: ["الساوند بار", "كيبل HDMI", "ريموت", "قطع تعليق"],
    },
    {
      id: "retro-speaker", name: "سبيكر ريترو", english: "RETRO", tag: "كلاسيك",
      tagline: "شكل زمان، صوت اليوم.",
      description: "سبيكر بتصميم خشبي كلاسيكي وأزرار معدنية، بصوت دافي وبلوتوث حديث. قطعة ديكور قبل ما تكون سبيكر.",
      colors: ["brown", "sand", "black"], choices: [],
    },
    {
      id: "speaker-lamp", name: "سبيكر بإضاءة", english: "LIGHT SPEAKER", tag: "أجواء",
      tagline: "صوت وضو بنفس اللحظة.",
      description: "سبيكر أسطواني بإضاءة LED بتتغيّر ألوانها مع الموسيقى، بيعطي غرفتك جو مختلف بالليل.",
      colors: ["black", "white"],
    },
    {
      id: "desk-speakers", name: "سبيكرات مكتب", english: "DESK PAIR", tag: "للمكتب",
      tagline: "صوت ستيريو على مكتبك.",
      description: "زوج سبيكرات للكمبيوتر بصوت ستيريو واضح وتصميم خشبي أنيق، مع منفذ سماعة وتحكم بالصوت من الأمام.",
      colors: ["brown", "black", "white"], choices: [pills("connection", "الاتصال", ["سلكي", "بلوتوث"])],
      inBox: ["السبيكرين", "كيبل توصيل", "كيبل كهربا"],
    },
    {
      id: "speaker-clip", name: "سبيكر كليب", english: "CLIP SPEAKER", tag: "للمشاوير",
      tagline: "علّقه وامشي.",
      description: "سبيكر صغير بكليب قوي بيعلق على الشنطة أو البسكليت، ضد الماء وصوته أقوى من حجمه بكثير.",
      colors: ["black", "orange", "olive"],
    },
    {
      id: "karaoke-mic", name: "مايك كاريوكي", english: "KARAOKE MIC", tag: "جو حلو",
      tagline: "كل سهرة صارت حفلة.",
      description: "مايك لاسلكي بسبيكر مدمج وتأثيرات صوت، بيتصل بالتلفون وبيخليك تغني مع أغانيك المفضلة وين ما كنت.",
      colors: ["black", "rose", "gold"], choices: [],
      features: [
        { icon: Mic, title: "صوت واضح", text: "بيلقط صوتك بدون تشويش." },
        { icon: Music, title: "تأثيرات صوت", text: "صدى وتغيير نبرة." },
        { icon: Speaker, title: "سبيكر مدمج", text: "ما بتحتاج إشي ثاني." },
        { icon: Bluetooth, title: "بلوتوث", text: "شغّل الأغاني من تلفونك." },
      ],
      inBox: ["المايك", "كيبل شحن", "شنطة صغيرة"],
    },
  ],
  gear: [
    {
      id: "phone-stand", name: "ستاند موبايل", english: "PHONE STAND", tag: "للمكتب",
      tagline: "تلفونك بزاوية مريحة.",
      description: "ستاند بزوايا قابلة للتعديل، مثالي لمكالمات الفيديو والوصفات ومتابعة الإشعارات وإنت بتشتغل.",
      colors: ["yellow", "black", "white", "silver"],
    },
    {
      id: "ring-light", name: "رينغ لايت", english: "RING LIGHT", tag: "لصناع المحتوى",
      tagline: "إضاءة احترافية بكبسة.",
      description: "حلقة إضاءة بثلاث درجات لون وعشر مستويات سطوع، مع حامل تلفون وستاند طويل. للتصوير، البث، والمكياج.",
      colors: ["black", "white"], choices: [pills("size", "المقاس", ["10 إنش", "18 إنش"])],
      features: [
        { icon: Lightbulb, title: "3 ألوان إضاءة", text: "دافي، طبيعي، وبارد." },
        { icon: Video, title: "للتصوير والبث", text: "وجهك واضح بكل فيديو." },
        { icon: Smartphone, title: "حامل تلفون", text: "بيثبت بالنص." },
        { icon: Wrench, title: "ستاند قابل للتعديل", text: "لحد مترين طول." },
      ],
      inBox: ["الحلقة", "ستاند", "حامل تلفون", "ريموت بلوتوث"],
    },
    {
      id: "tripod", name: "ترايبود موبايل", english: "TRIPOD", tag: "للتصوير",
      tagline: "صور ثابتة من أي زاوية.",
      description: "ترايبود خفيف بيتحول لعصا سيلفي، مع ريموت بلوتوث عشان تصوّر حالك وأصحابك من بعيد.",
      colors: ["black", "white"],
      inBox: ["الترايبود", "ريموت بلوتوث", "حامل تلفون"],
    },
    {
      id: "gimbal", name: "جيمبل", english: "GIMBAL", tag: "فيديو سينمائي",
      tagline: "فيديو ناعم وإنت بتركض.",
      description: "جيمبل بثلاث محاور بيثبت التلفون وبيلغي الاهتزاز، مع تتبع للوجه ووضعيات تصوير إبداعية.",
      colors: ["graphite", "white"], choices: [],
      features: [
        { icon: Video, title: "ثبات 3 محاور", text: "بدون ولا اهتزاز." },
        { icon: Activity, title: "تتبع ذكي", text: "بيلحق وجهك تلقائياً." },
        { icon: RotateCcw, title: "قابل للطي", text: "بيفوت بالشنطة." },
        { icon: BatteryCharging, title: "بطارية طويلة", text: "يوم تصوير كامل." },
      ],
      inBox: ["الجيمبل", "ترايبود صغير", "كيبل شحن", "شنطة"],
    },
    {
      id: "car-mount", name: "حامل سيارة", english: "CAR MOUNT", tag: "للطريق",
      tagline: "الخريطة قدامك والإيدين ع الستيرنج.",
      description: "حامل مغناطيسي للسيارة بيركب على فتحة المكيف أو الطبلون، بيثبت التلفون بقوة ويدور 360 درجة.",
      colors: ["black", "silver"], choices: [pills("mount", "طريقة التركيب", ["فتحة المكيف", "الطبلون"])],
    },
    {
      id: "smart-tag", name: "تاغ تتبّع", english: "SMART TAG", tag: "ما عاد تضيّع",
      tagline: "مفاتيحك؟ شنطتك؟ لاقيتهم.",
      description: "تاغ صغير بتعلقه على المفاتيح أو الشنطة، وبتلاقيه من تلفونك بصوت أو على الخريطة.",
      colors: ["white", "black"], choices: [pills("pack", "الكمية", ["قطعة وحدة", "باكيت 4"])],
      features: [
        { icon: MapPin, title: "على الخريطة", text: "اعرف آخر مكان كان فيه." },
        { icon: Volume2, title: "صوت تنبيه", text: "بيرن لما تدوّر عليه." },
        { icon: BatteryCharging, title: "بطارية سنة", text: "وبتتبدل بسهولة." },
        { icon: Package, title: "صغير وخفيف", text: "بيفوت بأي مكان." },
      ],
      inBox: ["التاغ", "علاقة مفاتيح"],
    },
    {
      id: "usb-hub", name: "هب USB-C", english: "USB-C HUB", tag: "للابتوب",
      tagline: "كل المنافذ اللي ناقصتك.",
      description: "هب بمنافذ USB وHDMI وقارئ ذاكرة، بيحول منفذ واحد بلابتوبك لمحطة شغل كاملة.",
      colors: ["graphite", "silver"], choices: [pills("ports", "المنافذ", ["4 منافذ", "7 منافذ"])],
      features: [
        { icon: Usb, title: "منافذ كثيرة", text: "USB وHDMI وذاكرة." },
        { icon: Zap, title: "شحن مباشر", text: "اشحن اللابتوب من خلاله." },
        { icon: Video, title: "شاشة 4K", text: "وصّل شاشة خارجية." },
        { icon: Plane, title: "خفيف للسفر", text: "أصغر من كف الإيد." },
      ],
    },
    {
      id: "keyboard", name: "كيبورد لاسلكي", english: "KEYBOARD", tag: "للشغل",
      tagline: "اكتب بهدوء وراحة.",
      description: "كيبورد نحيف بأزرار هادية، بيتصل بثلاث أجهزة وبتنقل بينهم بكبسة. عربي وإنجليزي.",
      colors: ["white", "graphite", "rose"], choices: [pills("layout", "الحروف", ["عربي / إنجليزي", "إنجليزي فقط"])],
      inBox: ["الكيبورد", "كيبل شحن"],
    },
    {
      id: "mouse", name: "ماوس لاسلكي", english: "MOUSE", tag: "مريح",
      tagline: "حركة دقيقة بدون صوت.",
      description: "ماوس مريح بشكل بيلبق على الإيد، أزراره هادية وبطاريته بتطول شهور. بيشتغل على أي سطح.",
      colors: ["graphite", "white", "rose", "sky"],
      inBox: ["الماوس", "مستقبل USB", "كيبل شحن"],
    },
    {
      id: "lav-mic", name: "مايك لاسلكي", english: "WIRELESS MIC", tag: "لصناع المحتوى",
      tagline: "صوتك واضح بكل فيديو.",
      description: "مايكين لاسلكيين بيلقطوا على اللبس مع مستقبل بيركب بالتلفون، بيلغوا الضجة وبيعطوك صوت ستوديو.",
      colors: ["black", "white"], choices: [pills("plug", "المنفذ", ["USB-C", "لايتنينج"])],
      features: [
        { icon: Mic, title: "صوت ستوديو", text: "بيلغي ضجة الشارع." },
        { icon: Bluetooth, title: "مدى 50 متر", text: "صوّر من بعيد." },
        { icon: Video, title: "لصناع المحتوى", text: "مقابلات، فلوقات، وريلز." },
        { icon: BatteryCharging, title: "علبة شحن", text: "بتشحنهم وإنت ماشي." },
      ],
      inBox: ["مايكين", "مستقبل", "علبة شحن", "كيبل"],
    },
  ],
};

export const products: Product[] = categories.flatMap(({ id: category }) => {
  const defaults = DEFAULTS[category];
  return CATALOG[category].map((seed, index): Product => ({
    id: seed.id,
    name: seed.name,
    english: seed.english,
    category,
    image: seed.image ?? `/catalog/${seed.id}.jpg`,
    images: [seed.image ?? `/catalog/${seed.id}.jpg`, ...(seed.gallery ?? [`/catalog/${seed.id}-2.jpg`, `/catalog/${seed.id}-3.jpg`])],
    alt: seed.alt ?? seed.name,
    tag: seed.tag,
    number: String(index + 1).padStart(2, "0"),
    tagline: seed.tagline,
    description: seed.description,
    options: [
      { id: "color", label: "اللون", kind: "color", values: seed.colors.map(id => ({ id, ...PALETTE[id] })) },
      ...(seed.choices ?? defaults.choices),
    ],
    features: seed.features ?? defaults.features,
    inBox: seed.inBox ?? defaults.inBox,
  }));
});

export const getProduct = (id: string) => products.find(product => product.id === id);

export const getCategory = (id: CategoryId) => categories.find(category => category.id === id)!;

export const productsIn = (id: CategoryId) => products.filter(product => product.category === id);

export const defaultSelection = (product: Product): Record<string, string> =>
  Object.fromEntries(product.options.map(group => [group.id, group.values[0]!.id]));

export const selectionLabel = (product: Product, selection: Record<string, string>) =>
  product.options.map(group => group.values.find(value => value.id === selection[group.id])?.label).filter(Boolean).join(" · ");
