export type TripType = "round-trip" | "one-way";
export type CabinClass = "economy" | "business" | "first";
export type PassengerType = "adult" | "child" | "infant";
export type SeatType = "standard" | "extra-legroom" | "window" | "aisle";

export interface DestinationRecord {
  id: string;
  city: string;
  country: string;
  region: string;
  teaser: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface FareMatrix {
  oneWay: Record<CabinClass, Record<PassengerType, number>>;
  roundTrip: Record<CabinClass, Record<PassengerType, number>>;
}

export interface DestinationPricingRecord {
  destinationId: string;
  fares: FareMatrix;
}

export interface SeatMapSeat {
  id: string;
  row: number;
  column: string;
  label: string;
  type: SeatType;
  available: boolean;
  price: number;
}

export interface PromoCodeRecord {
  code: string;
  label: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  destinationIds?: string[];
  cabinClasses?: CabinClass[];
}

export interface AutoDiscountRule {
  id: string;
  label: string;
  type: "early-bird" | "destination";
  value: number;
  minDaysBeforeDeparture?: number;
  destinationIds?: string[];
}

export interface TravelDataset {
  destinations: DestinationRecord[];
  pricing: DestinationPricingRecord[];
  seatMap: SeatMapSeat[];
  promoCodes: PromoCodeRecord[];
  autoDiscounts: AutoDiscountRule[];
}

const byPassenger = (adult: number, child: number, infant: number) => ({
  adult,
  child,
  infant,
});

const byTrip = (
  economy: ReturnType<typeof byPassenger>,
  business: ReturnType<typeof byPassenger>,
  first: ReturnType<typeof byPassenger>,
) => ({
  economy,
  business,
  first,
});

const createFareMatrix = (economyAdult: number) => ({
  oneWay: byTrip(
    byPassenger(economyAdult, Math.round(economyAdult * 0.74), Math.round(economyAdult * 0.3)),
    byPassenger(Math.round(economyAdult * 2.2), Math.round(economyAdult * 1.63), Math.round(economyAdult * 0.55)),
    byPassenger(Math.round(economyAdult * 3.05), Math.round(economyAdult * 2.29), Math.round(economyAdult * 0.73)),
  ),
  roundTrip: byTrip(
    byPassenger(Math.round(economyAdult * 1.88), Math.round(economyAdult * 1.39), Math.round(economyAdult * 0.52)),
    byPassenger(Math.round(economyAdult * 4.1), Math.round(economyAdult * 3.07), Math.round(economyAdult * 0.97)),
    byPassenger(Math.round(economyAdult * 5.96), Math.round(economyAdult * 4.47), Math.round(economyAdult * 1.42)),
  ),
});

export const defaultTravelDataset: TravelDataset = {
  destinations: [
    {
      id: "riyadh",
      city: "الرياض",
      country: "السعودية",
      region: "نجد",
      teaser: "عاصمة الأعمال والفعاليات",
      description: "رحلات مريحة إلى الرياض مع خيارات مناسبة للأعمال والمؤتمرات والتسوق الراقي.",
      image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "jeddah",
      city: "جدة",
      country: "السعودية",
      region: "الحجاز",
      teaser: "واجهة بحرية وحياة نابضة",
      description: "وجهة مثالية للبحر والأعمال والزيارات العائلية مع رحلات متعددة يومياً.",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "dammam",
      city: "الدمام",
      country: "السعودية",
      region: "المنطقة الشرقية",
      teaser: "قرب الخليج ومراكز الأعمال",
      description: "رحلات مرنة إلى الدمام والخبر والظهران مع درجات متعددة للمسافرين.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "abha",
      city: "أبها",
      country: "السعودية",
      region: "عسير",
      teaser: "جبال وأجواء معتدلة",
      description: "خيار سياحي مميز لعشاق الطبيعة والمرتفعات والأجواء الهادئة.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "kuwait-city",
      city: "مدينة الكويت",
      country: "الكويت",
      region: "العاصمة",
      teaser: "مركز الأعمال والضيافة",
      description: "رحلات مباشرة إلى قلب الكويت مع خيارات سفر مناسبة للأعمال والزيارات السريعة.",
      image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "salmiya",
      city: "السالمية",
      country: "الكويت",
      region: "محافظة حولي",
      teaser: "واجهة بحرية وتسوق",
      description: "وجهة مفضلة للسكن والتسوق والمطاعم مع وصول سهل إلى أهم مناطق الكويت.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "hawalli",
      city: "حولي",
      country: "الكويت",
      region: "محافظة حولي",
      teaser: "منطقة حيوية وخدمات متنوعة",
      description: "مناسبة للمسافرين الباحثين عن موقع مركزي قريب من المرافق التجارية والسكنية.",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "farwaniya",
      city: "الفروانية",
      country: "الكويت",
      region: "محافظة الفروانية",
      teaser: "قرب المطار وخدمات يومية",
      description: "خيار عملي للمسافرين القادمين للأعمال أو الإقامة القصيرة بالقرب من المطار.",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "manama",
      city: "المنامة",
      country: "البحرين",
      region: "العاصمة",
      teaser: "مركز مالي وترفيهي",
      description: "رحلات إلى المنامة مع خيارات مناسبة للأعمال والفعاليات والمطاعم الراقية.",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "muharraq",
      city: "المحرق",
      country: "البحرين",
      region: "محافظة المحرق",
      teaser: "تراث بحريني وموقع استراتيجي",
      description: "منطقة غنية بالتراث وقريبة من المطار والمشاريع الساحلية الحديثة.",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "riffa",
      city: "الرفاع",
      country: "البحرين",
      region: "المحافظة الجنوبية",
      teaser: "أحياء راقية ومرافق حديثة",
      description: "وجهة مناسبة للعائلات والإقامات الهادئة مع قربها من الخدمات والمجمعات.",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "sitra",
      city: "سترة",
      country: "البحرين",
      region: "المحافظة الجنوبية",
      teaser: "منطقة بحرية وصناعية",
      description: "خيار عملي لرحلات العمل والزيارات المحلية مع قربها من المحاور الرئيسية.",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "muscat",
      city: "مسقط",
      country: "عُمان",
      region: "محافظة مسقط",
      teaser: "هدوء وأناقة ساحلية",
      description: "عاصمة عُمان بواجهاتها البحرية الهادئة ومرافقها الراقية وأسواقها التقليدية.",
      image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "salalah",
      city: "صلالة",
      country: "عُمان",
      region: "محافظة ظفار",
      teaser: "خريف وطبيعة استثنائية",
      description: "وجهة سياحية محبوبة في موسم الخريف مع طبيعة خضراء وأجواء منعشة.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "sohar",
      city: "صحار",
      country: "عُمان",
      region: "شمال الباطنة",
      teaser: "ميناء وأعمال وساحل",
      description: "خيار مميز لرحلات الأعمال والزيارات العائلية على الساحل العُماني.",
      image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "nizwa",
      city: "نزوى",
      country: "عُمان",
      region: "الداخلية",
      teaser: "تراث وأسواق جبلية",
      description: "مدينة تاريخية تناسب الباحثين عن الطابع العُماني الأصيل والقلاع والأسواق.",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "london",
      city: "لندن",
      country: "المملكة المتحدة",
      region: "أوروبا الغربية",
      teaser: "أناقة ملكية وأسواق راقية",
      description: "رحلات فاخرة إلى قلب لندن مع خيارات تسوق ومتاحف وفنادق تاريخية.",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "istanbul",
      city: "إسطنبول",
      country: "تركيا",
      region: "أوروبا وآسيا",
      teaser: "تاريخ حي يلتقي بالتسوق",
      description: "مدينة تجمع البوسفور والأسواق الكبرى والمطاعم الحديثة ضمن رحلة مباشرة مريحة.",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "paris",
      city: "باريس",
      country: "فرنسا",
      region: "أوروبا الغربية",
      teaser: "فنون ومطاعم وتجربة أوروبية",
      description: "خطوط سفر راقية إلى باريس مع درجات مرنة وخيارات عائلية للأعمار المختلفة.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "new-york",
      city: "نيويورك",
      country: "الولايات المتحدة",
      region: "أمريكا الشمالية",
      teaser: "أيقونة عالمية للأعمال والترفيه",
      description: "رحلات إلى نيويورك مع تجربة حضرية مميزة تشمل مانهاتن والتسوق والعروض العالمية.",
      image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "doha",
      city: "الدوحة",
      country: "قطر",
      region: "الخليج العربي",
      teaser: "ضيافة قطرية ومشهد عصري",
      description: "وجهة متميزة للفعاليات والأعمال مع باقات مرنة ومقاعد مختارة.",
      image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "lusail",
      city: "لوسيل",
      country: "قطر",
      region: "بلدية الظعاين",
      teaser: "مدينة حديثة وواجهة راقية",
      description: "تجربة حضرية حديثة مع المارينا والمرافق الجديدة والفعاليات الكبرى.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "al-wakrah",
      city: "الوكرة",
      country: "قطر",
      region: "بلدية الوكرة",
      teaser: "كورنيش وهدوء ساحلي",
      description: "وجهة مريحة تجمع الساحل والأسواق المحلية والمرافق العائلية الحديثة.",
      image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "al-khor",
      city: "الخور",
      country: "قطر",
      region: "بلدية الخور والذخيرة",
      teaser: "طابع بحري ومناطق شمالية",
      description: "خيار مناسب للرحلات الهادئة والزيارات الشمالية مع أجواء بحرية مميزة.",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "dubai",
      city: "دبي",
      country: "الإمارات",
      region: "الخليج العربي",
      teaser: "أعمال فاخرة وترفيه عالمي",
      description: "وجهة متكاملة للتسوق، الأعمال، والمنتجعات مع رحلات مرنة على مدار الأسبوع.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "abu-dhabi",
      city: "أبوظبي",
      country: "الإمارات",
      region: "إمارة أبوظبي",
      teaser: "عاصمة الثقافة والأعمال",
      description: "رحلات إلى أبوظبي مع متاحف عالمية وشواطئ راقية ومقار أعمال كبرى.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "sharjah",
      city: "الشارقة",
      country: "الإمارات",
      region: "إمارة الشارقة",
      teaser: "ثقافة وأسواق عائلية",
      description: "وجهة مناسبة للعائلات والأنشطة الثقافية مع قربها من دبي وسهولة الوصول.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "ajman",
      city: "عجمان",
      country: "الإمارات",
      region: "إمارة عجمان",
      teaser: "ساحل هادئ وإقامة مريحة",
      description: "خيار جيد للإقامات الهادئة بالقرب من المراكز الحيوية في الدولة.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "ras-al-khaimah",
      city: "رأس الخيمة",
      country: "الإمارات",
      region: "إمارة رأس الخيمة",
      teaser: "جبال ومنتجعات وشواطئ",
      description: "وجهة ممتازة للترفيه والطبيعة والمنتجعات الهادئة شمال الإمارات.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "fujairah",
      city: "الفجيرة",
      country: "الإمارات",
      region: "إمارة الفجيرة",
      teaser: "ساحل شرقي وغوص واسترخاء",
      description: "منطقة مناسبة لعشاق البحر والهدوء على الساحل الشرقي للإمارات.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "maldives",
      city: "جزر المالديف",
      country: "المالديف",
      region: "المحيط الهندي",
      teaser: "استجمام فاخر فوق الماء",
      description: "خيار مثالي لشهر العسل والعطلات الهادئة مع منتجعات خاصة وتجربة طيران مميزة.",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      id: "bangkok",
      city: "بانكوك",
      country: "تايلند",
      region: "جنوب شرق آسيا",
      teaser: "مدينة نابضة بطابع آسيوي حديث",
      description: "تجربة مميزة لعشاق المطاعم والتسوق والرحلات الطويلة بأسعار تنافسية.",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "geneva",
      city: "جنيف",
      country: "سويسرا",
      region: "أوروبا الوسطى",
      teaser: "هدوء أوروبي وبحيرات راقية",
      description: "وجهة راقية لعشاق الطبيعة الهادئة والاجتماعات الدولية والإقامة الفاخرة.",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "rome",
      city: "روما",
      country: "إيطاليا",
      region: "جنوب أوروبا",
      teaser: "إرث تاريخي ومذاق إيطالي",
      description: "رحلات مريحة إلى مدينة الفن والآثار والمطابخ الإيطالية الراقية.",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
    {
      id: "kuala-lumpur",
      city: "كوالالمبور",
      country: "ماليزيا",
      region: "جنوب شرق آسيا",
      teaser: "توازن بين الحداثة والطبيعة",
      description: "خيار ممتاز للعائلات والمسافرين الباحثين عن قيمة عالية وتجربة آسيوية متنوعة.",
      image: "https://images.unsplash.com/photo-1562504208-03d85cc8c23e?auto=format&fit=crop&w=1600&q=80",
      featured: false,
    },
  ],
  pricing: [
    { destinationId: "riyadh", fares: createFareMatrix(760) },
    { destinationId: "jeddah", fares: createFareMatrix(740) },
    { destinationId: "dammam", fares: createFareMatrix(690) },
    { destinationId: "abha", fares: createFareMatrix(720) },
    { destinationId: "kuwait-city", fares: createFareMatrix(790) },
    { destinationId: "salmiya", fares: createFareMatrix(780) },
    { destinationId: "hawalli", fares: createFareMatrix(760) },
    { destinationId: "farwaniya", fares: createFareMatrix(730) },
    { destinationId: "manama", fares: createFareMatrix(720) },
    { destinationId: "muharraq", fares: createFareMatrix(700) },
    { destinationId: "riffa", fares: createFareMatrix(710) },
    { destinationId: "sitra", fares: createFareMatrix(680) },
    { destinationId: "muscat", fares: createFareMatrix(810) },
    { destinationId: "salalah", fares: createFareMatrix(980) },
    { destinationId: "sohar", fares: createFareMatrix(770) },
    { destinationId: "nizwa", fares: createFareMatrix(750) },
    { destinationId: "london", fares: createFareMatrix(1320) },
    { destinationId: "istanbul", fares: createFareMatrix(840) },
    { destinationId: "paris", fares: createFareMatrix(1210) },
    { destinationId: "new-york", fares: createFareMatrix(1890) },
    { destinationId: "doha", fares: createFareMatrix(690) },
    { destinationId: "lusail", fares: createFareMatrix(710) },
    { destinationId: "al-wakrah", fares: createFareMatrix(670) },
    { destinationId: "al-khor", fares: createFareMatrix(650) },
    { destinationId: "dubai", fares: createFareMatrix(920) },
    { destinationId: "abu-dhabi", fares: createFareMatrix(940) },
    { destinationId: "sharjah", fares: createFareMatrix(790) },
    { destinationId: "ajman", fares: createFareMatrix(760) },
    { destinationId: "ras-al-khaimah", fares: createFareMatrix(800) },
    { destinationId: "fujairah", fares: createFareMatrix(820) },
    { destinationId: "maldives", fares: createFareMatrix(1760) },
    { destinationId: "bangkok", fares: createFareMatrix(1180) },
    { destinationId: "geneva", fares: createFareMatrix(1480) },
    { destinationId: "rome", fares: createFareMatrix(1260) },
    { destinationId: "kuala-lumpur", fares: createFareMatrix(1380) },
  ],
  seatMap: Array.from({ length: 6 }, (_, rowIndex) => {
    const row = rowIndex + 1;
    return ["A", "B", "C", "D", "E", "F"].map((column) => {
      const type: SeatType =
        row <= 2 ? "extra-legroom" : column === "A" || column === "F" ? "window" : column === "C" || column === "D" ? "aisle" : "standard";
      const price =
        type === "extra-legroom" ? 180 : type === "window" || type === "aisle" ? 45 : 0;

      return {
        id: `${row}${column}`,
        row,
        column,
        label: `${row}${column}`,
        type,
        available: !["2C", "3D"].includes(`${row}${column}`),
        price,
      };
    });
  }).flat(),
  promoCodes: [
    {
      code: "LONDON10",
      label: "خصم حصري على لندن",
      type: "percentage",
      value: 10,
      active: true,
      destinationIds: ["london"],
    },
    {
      code: "SKY200",
      label: "خصم ثابت على السلة",
      type: "fixed",
      value: 200,
      active: true,
    },
  ],
  autoDiscounts: [
    {
      id: "early-bird",
      label: "خصم 10% للحجز المبكر",
      type: "early-bird",
      value: 10,
      minDaysBeforeDeparture: 45,
    },
    {
      id: "istanbul-special",
      label: "عرض إسطنبول الحصري",
      type: "destination",
      value: 8,
      destinationIds: ["istanbul"],
    },
  ],
};

export const cabinClassLabels: Record<CabinClass, string> = {
  economy: "السياحية",
  business: "رجال الأعمال",
  first: "الأولى",
};

export const passengerTypeLabels: Record<PassengerType, string> = {
  adult: "بالغ",
  child: "طفل",
  infant: "رضيع",
};

export const seatTypeLabels: Record<SeatType, string> = {
  standard: "مقعد مجاني",
  "extra-legroom": "مساحة أرجل إضافية",
  window: "نافذة",
  aisle: "ممر",
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-QA", {
    style: "currency",
    currency: "QAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getDestinationPricing(
  dataset: TravelDataset,
  destinationId: string,
  tripType: TripType,
  cabinClass: CabinClass,
  passengerType: PassengerType,
) {
  const pricing = dataset.pricing.find((item) => item.destinationId === destinationId);
  if (!pricing) return 0;
  return pricing.fares[tripType === "one-way" ? "oneWay" : "roundTrip"][cabinClass][passengerType];
}

export function getFeaturedDestinations(dataset: TravelDataset) {
  return dataset.destinations.filter((destination) => destination.featured);
}
