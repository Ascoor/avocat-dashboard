export interface LocalizedText {
  ar: string;
  en: string;
}

export interface DashboardMetric {
  label: LocalizedText;
  value: LocalizedText;
}

export interface DashboardPreview {
  gradient: string;
  accentText: string;
}

export interface DashboardDefinition {
  id: number;
  slug: string;
  accent: string;
  preview: DashboardPreview;
  badge: LocalizedText;
  category: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  features: LocalizedText[];
  metrics: DashboardMetric;
}

export const DASHBOARD_CATALOG = [
  {
    "id": 1,
    "slug": "dashboard-1",
    "accent": "from-indigo-500/30 via-purple-500/20 to-slate-900/60",
    "preview": {
      "gradient": "from-indigo-500 to-purple-500",
      "accentText": "text-indigo-300"
    },
    "badge": {
      "ar": "النمو",
      "en": "Growth"
    },
    "category": {
      "ar": "منتجات SaaS",
      "en": "SaaS products"
    },
    "title": {
      "ar": "لوحة تحليلات النمو",
      "en": "Growth analytics dashboard"
    },
    "summary": {
      "ar": "مراقبة مؤشرات النمو والاكتساب والاحتفاظ لمنتج SaaS ناشئ.",
      "en": "Track growth, acquisition, and retention signals for a scaling SaaS product."
    },
    "description": {
      "ar": "مراقبة مؤشرات النمو والاكتساب والاحتفاظ لمنتج SaaS ناشئ.",
      "en": "Track growth, acquisition, and retention signals for a scaling SaaS product."
    },
    "features": [
      {
        "ar": "مخططات نمو أسبوعية",
        "en": "Weekly growth curves"
      },
      {
        "ar": "تحليلات قنوات الاكتساب",
        "en": "Acquisition channel analytics"
      },
      {
        "ar": "جدول أحداث الانطلاق",
        "en": "Launch milestone timeline"
      }
    ],
    "metrics": {
      "label": {
        "ar": "محتويات جاهزة",
        "en": "Production-ready sections"
      },
      "value": {
        "ar": "5 وحدات",
        "en": "5 sections"
      }
    }
  },
  {
    "id": 2,
    "slug": "dashboard-2",
    "accent": "from-cyan-500/30 via-sky-500/20 to-slate-900/60",
    "preview": {
      "gradient": "from-emerald-500 to-teal-500",
      "accentText": "text-emerald-300"
    },
    "badge": {
      "ar": "المشاريع",
      "en": "Projects"
    },
    "category": {
      "ar": "إدارة المحافظ",
      "en": "Portfolio management"
    },
    "title": {
      "ar": "لوحة إدارة المشاريع",
      "en": "Project portfolio dashboard"
    },
    "summary": {
      "ar": "تنسيق خارطة الطريق، المخاطر، وسعة الفرق عبر مبادرات متعددة.",
      "en": "Coordinate roadmaps, risks, and team capacity across strategic initiatives."
    },
    "description": {
      "ar": "تنسيق خارطة الطريق، المخاطر، وسعة الفرق عبر مبادرات متعددة.",
      "en": "Coordinate roadmaps, risks, and team capacity across strategic initiatives."
    },
    "features": [
      {
        "ar": "منحنى السرعة التراكمية",
        "en": "Cumulative velocity chart"
      },
      {
        "ar": "لوحة متابعة المخاطر",
        "en": "Risk tracking board"
      },
      {
        "ar": "قوائم المشاريع ذات الأولوية",
        "en": "Prioritised project lists"
      }
    ],
    "metrics": {
      "label": {
        "ar": "قوالب جاهزة",
        "en": "Reusable layouts"
      },
      "value": {
        "ar": "6 لوحات",
        "en": "6 layouts"
      }
    }
  },
  {
    "id": 3,
    "slug": "dashboard-3",
    "accent": "from-amber-500/35 via-orange-500/20 to-slate-900/60",
    "preview": {
      "gradient": "from-amber-500 to-orange-500",
      "accentText": "text-amber-300"
    },
    "badge": {
      "ar": "تجارة",
      "en": "Commerce"
    },
    "category": {
      "ar": "متاجر رقمية",
      "en": "Digital retail"
    },
    "title": {
      "ar": "لوحة تجارة إلكترونية",
      "en": "E-commerce intelligence dashboard"
    },
    "summary": {
      "ar": "لوحة مبيعات متكاملة تجمع الإيرادات، القنوات، وتجربة العملاء.",
      "en": "A commerce control centre blending revenue, channels, and customer experience."
    },
    "description": {
      "ar": "لوحة مبيعات متكاملة تجمع الإيرادات، القنوات، وتجربة العملاء.",
      "en": "A commerce control centre blending revenue, channels, and customer experience."
    },
    "features": [
      {
        "ar": "إيرادات يومية مباشرة",
        "en": "Live daily revenue"
      },
      {
        "ar": "ترتيب القنوات الأعلى أداءً",
        "en": "Top-performing channel ranking"
      },
      {
        "ar": "متابعة حالة الشحنات",
        "en": "Fulfilment status tracking"
      }
    ],
    "metrics": {
      "label": {
        "ar": "عناصر الواجهة",
        "en": "Interface components"
      },
      "value": {
        "ar": "6 عناصر",
        "en": "6 components"
      }
    }
  },
  {
    "id": 4,
    "slug": "dashboard-4",
    "accent": "from-sky-500/30 via-cyan-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-sky-500 to-cyan-500",
      "accentText": "text-sky-300"
    },
    "badge": {
      "ar": "البنية السحابية",
      "en": "Cloud ops"
    },
    "category": {
      "ar": "مركز العمليات",
      "en": "Operations centre"
    },
    "title": {
      "ar": "لوحة مراقبة البنية السحابية",
      "en": "Cloud infrastructure monitor"
    },
    "summary": {
      "ar": "رصد موحد لحمل الموارد، التنبيهات الحية، وتوافر المناطق.",
      "en": "Unified monitoring for resource load, live alerts, and regional availability."
    },
    "description": {
      "ar": "رصد موحد لحمل الموارد، التنبيهات الحية، وتوافر المناطق.",
      "en": "Unified monitoring for resource load, live alerts, and regional availability."
    },
    "features": [
      {
        "ar": "تنبيهات الخدمات الحرجة",
        "en": "Critical service alerts"
      },
      {
        "ar": "مخططات الأداء الزمني",
        "en": "Time-series performance panels"
      },
      {
        "ar": "بطاقات توافر المناطق",
        "en": "Regional availability cards"
      }
    ],
    "metrics": {
      "label": {
        "ar": "شرائح جاهزة",
        "en": "Drop-in widgets"
      },
      "value": {
        "ar": "4 أقسام",
        "en": "4 sections"
      }
    }
  },
  {
    "id": 5,
    "slug": "dashboard-5",
    "accent": "from-sky-400/25 via-emerald-400/20 to-slate-900/70",
    "preview": {
      "gradient": "from-rose-500 to-pink-500",
      "accentText": "text-rose-300"
    },
    "badge": {
      "ar": "الاستمرارية",
      "en": "Resilience"
    },
    "category": {
      "ar": "الاستجابة للحوادث",
      "en": "Incident response"
    },
    "title": {
      "ar": "لوحة مراقبة البنية السحابية",
      "en": "Cloud reliability war-room"
    },
    "summary": {
      "ar": "إدارة الأعطال والسعة مع جداول الحوادث وخطط التوسع.",
      "en": "Manage outages and capacity with incident logs and scaling readiness."
    },
    "description": {
      "ar": "إدارة الأعطال والسعة مع جداول الحوادث وخطط التوسع.",
      "en": "Manage outages and capacity with incident logs and scaling readiness."
    },
    "features": [
      {
        "ar": "قائمة الحوادث المباشرة",
        "en": "Live incident roster"
      },
      {
        "ar": "مؤشرات حالة الموارد",
        "en": "Resource health badges"
      },
      {
        "ar": "خيارات توسيع فورية",
        "en": "On-demand scaling actions"
      }
    ],
    "metrics": {
      "label": {
        "ar": "حزم مدمجة",
        "en": "Embedded blocks"
      },
      "value": {
        "ar": "3 لوحات",
        "en": "3 blocks"
      }
    }
  },
  {
    "id": 6,
    "slug": "dashboard-6",
    "accent": "from-fuchsia-500/30 via-pink-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-fuchsia-500 to-purple-500",
      "accentText": "text-fuchsia-300"
    },
    "badge": {
      "ar": "العملاء",
      "en": "CX"
    },
    "category": {
      "ar": "نجاح العملاء",
      "en": "Customer success"
    },
    "title": {
      "ar": "لوحة تجربة العملاء",
      "en": "Customer experience cockpit"
    },
    "summary": {
      "ar": "قياس المشاعر، مؤشرات SLA، وتجربة الدعم في الوقت الفعلي.",
      "en": "Measure sentiment, SLA performance, and support workload in real time."
    },
    "description": {
      "ar": "قياس المشاعر، مؤشرات SLA، وتجربة الدعم في الوقت الفعلي.",
      "en": "Measure sentiment, SLA performance, and support workload in real time."
    },
    "features": [
      {
        "ar": "تحليل المشاعر الآلي",
        "en": "Automated sentiment analysis"
      },
      {
        "ar": "مؤشرات زمن الاستجابة",
        "en": "Response-time indicators"
      },
      {
        "ar": "لوحات التذاكر المفتوحة",
        "en": "Open ticket panels"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاطع محسّنة",
        "en": "Optimised modules"
      },
      "value": {
        "ar": "6 عناصر",
        "en": "6 modules"
      }
    }
  },
  {
    "id": 7,
    "slug": "dashboard-7",
    "accent": "from-lime-500/25 via-emerald-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-lime-500 to-emerald-500",
      "accentText": "text-lime-300"
    },
    "badge": {
      "ar": "الموظفون",
      "en": "People"
    },
    "category": {
      "ar": "إدارة المواهب",
      "en": "Talent management"
    },
    "title": {
      "ar": "لوحة الموارد البشرية",
      "en": "People operations dashboard"
    },
    "summary": {
      "ar": "تحليلات القوى العاملة، التوظيف، وبرامج التطوير في لوحة واحدة.",
      "en": "Workforce analytics, hiring pipelines, and development programs in one view."
    },
    "description": {
      "ar": "تحليلات القوى العاملة، التوظيف، وبرامج التطوير في لوحة واحدة.",
      "en": "Workforce analytics, hiring pipelines, and development programs in one view."
    },
    "features": [
      {
        "ar": "مؤشرات القوى العاملة",
        "en": "Workforce KPIs"
      },
      {
        "ar": "جداول الوظائف المفتوحة",
        "en": "Open role matrices"
      },
      {
        "ar": "لوحة نبض الموظفين",
        "en": "Employee pulse board"
      }
    ],
    "metrics": {
      "label": {
        "ar": "عناصر تحليلات",
        "en": "Analytic cards"
      },
      "value": {
        "ar": "7 بطاقات",
        "en": "7 cards"
      }
    }
  },
  {
    "id": 8,
    "slug": "dashboard-8",
    "accent": "from-blue-500/30 via-sky-400/20 to-slate-900/70",
    "preview": {
      "gradient": "from-blue-500 to-indigo-500",
      "accentText": "text-blue-300"
    },
    "badge": {
      "ar": "التعليم",
      "en": "Learning"
    },
    "category": {
      "ar": "منصات تعليمية",
      "en": "Learning platforms"
    },
    "title": {
      "ar": "لوحة إدارة التعليم الإلكتروني",
      "en": "E-learning analytics dashboard"
    },
    "summary": {
      "ar": "متابعة المتعلمين، نسب الإكمال، وتفاعل المحتوى للمنصات التعليمية.",
      "en": "Monitor learners, completion rates, and content engagement for academies."
    },
    "description": {
      "ar": "متابعة المتعلمين، نسب الإكمال، وتفاعل المحتوى للمنصات التعليمية.",
      "en": "Monitor learners, completion rates, and content engagement for academies."
    },
    "features": [
      {
        "ar": "مخطط نشاط المتعلمين",
        "en": "Learner activity curve"
      },
      {
        "ar": "قائمة الدورات المتميزة",
        "en": "Top-rated courses list"
      },
      {
        "ar": "جدول تقدم المتعلمين",
        "en": "Learner progress table"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاطع تعليمية",
        "en": "Learning widgets"
      },
      "value": {
        "ar": "6 وحدات",
        "en": "6 widgets"
      }
    }
  },
  {
    "id": 9,
    "slug": "dashboard-9",
    "accent": "from-slate-600/40 via-emerald-500/10 to-slate-900/80",
    "preview": {
      "gradient": "from-slate-500 to-slate-700",
      "accentText": "text-slate-300"
    },
    "badge": {
      "ar": "الأمن",
      "en": "Security"
    },
    "category": {
      "ar": "مركز الدفاع",
      "en": "Security centre"
    },
    "title": {
      "ar": "لوحة أمن المعلومات",
      "en": "Cyber security dashboard"
    },
    "summary": {
      "ar": "مراقبة التهديدات، الامتثال، ووقت الاستجابة للهجمات الرقمية.",
      "en": "Monitor threats, compliance posture, and cyber incident response times."
    },
    "description": {
      "ar": "مراقبة التهديدات، الامتثال، ووقت الاستجابة للهجمات الرقمية.",
      "en": "Monitor threats, compliance posture, and cyber incident response times."
    },
    "features": [
      {
        "ar": "مستويات الخطر المباشرة",
        "en": "Live threat levels"
      },
      {
        "ar": "توزيع الحوادث حسب النظام",
        "en": "Incidents by surface"
      },
      {
        "ar": "مخطط الاستجابة للحوادث",
        "en": "Incident response chart"
      }
    ],
    "metrics": {
      "label": {
        "ar": "لوحات أمنية",
        "en": "Security panels"
      },
      "value": {
        "ar": "5 عروض",
        "en": "5 panels"
      }
    }
  },
  {
    "id": 10,
    "slug": "dashboard-10",
    "accent": "from-violet-500/30 via-indigo-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-cyan-500 to-emerald-500",
      "accentText": "text-cyan-300"
    },
    "badge": {
      "ar": "المالية",
      "en": "Finance"
    },
    "category": {
      "ar": "الخدمات المالية",
      "en": "Financial services"
    },
    "title": {
      "ar": "لوحة الخدمات المالية",
      "en": "Financial services performance"
    },
    "summary": {
      "ar": "عرض المحافظ، المخاطر، والأحداث التنظيمية لفرق الاستثمار.",
      "en": "Visualise portfolios, risk posture, and regulatory events for investment teams."
    },
    "description": {
      "ar": "عرض المحافظ، المخاطر، والأحداث التنظيمية لفرق الاستثمار.",
      "en": "Visualise portfolios, risk posture, and regulatory events for investment teams."
    },
    "features": [
      {
        "ar": "مخطط أداء المحافظ",
        "en": "Portfolio performance graph"
      },
      {
        "ar": "لوحة المخاطر والامتثال",
        "en": "Risk & compliance board"
      },
      {
        "ar": "خط زمني للأحداث المالية",
        "en": "Financial events timeline"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مكونات جاهزة",
        "en": "Ready components"
      },
      "value": {
        "ar": "6 أقسام",
        "en": "6 sections"
      }
    }
  },
  {
    "id": 11,
    "slug": "dashboard-11",
    "accent": "from-emerald-500/30 via-teal-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-teal-500 to-emerald-500",
      "accentText": "text-teal-300"
    },
    "badge": {
      "ar": "الصحة",
      "en": "Health"
    },
    "category": {
      "ar": "العمليات السريرية",
      "en": "Clinical ops"
    },
    "title": {
      "ar": "لوحة عمليات الرعاية الصحية",
      "en": "Healthcare operations dashboard"
    },
    "summary": {
      "ar": "تنسيق تدفق المرضى، تنبيهات سريرية، واستعداد الخدمات للمستشفيات.",
      "en": "Coordinate patient flow, clinical alerts, and service readiness for hospitals."
    },
    "description": {
      "ar": "تنسيق تدفق المرضى، تنبيهات سريرية، واستعداد الخدمات للمستشفيات.",
      "en": "Coordinate patient flow, clinical alerts, and service readiness for hospitals."
    },
    "features": [
      {
        "ar": "مخطط تدفق المرضى",
        "en": "Patient flow chart"
      },
      {
        "ar": "تنبيهات طبية حرجة",
        "en": "Critical clinical alerts"
      },
      {
        "ar": "قوائم جاهزية الأقسام",
        "en": "Service readiness lists"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاييس متخصصة",
        "en": "Specialised metrics"
      },
      "value": {
        "ar": "5 عناصر",
        "en": "5 items"
      }
    }
  },
  {
    "id": 12,
    "slug": "dashboard-12",
    "accent": "from-rose-500/30 via-fuchsia-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-rose-500 to-amber-500",
      "accentText": "text-rose-300"
    },
    "badge": {
      "ar": "التسويق",
      "en": "Marketing"
    },
    "category": {
      "ar": "قنوات متعددة",
      "en": "Omnichannel"
    },
    "title": {
      "ar": "لوحة حملات التسويق",
      "en": "Marketing campaigns dashboard"
    },
    "summary": {
      "ar": "مراقبة الإنفاق، الأداء متعدد القنوات، وأتمتة الحملات.",
      "en": "Monitor spend, multi-channel performance, and campaign automation."
    },
    "description": {
      "ar": "مراقبة الإنفاق، الأداء متعدد القنوات، وأتمتة الحملات.",
      "en": "Monitor spend, multi-channel performance, and campaign automation."
    },
    "features": [
      {
        "ar": "مخطط الأداء متعدد القنوات",
        "en": "Omnichannel performance chart"
      },
      {
        "ar": "قائمة الحملات البارزة",
        "en": "Highlighted campaign list"
      },
      {
        "ar": "جدول رحلات الأتمتة",
        "en": "Automation journey table"
      }
    ],
    "metrics": {
      "label": {
        "ar": "شرائح حملات",
        "en": "Campaign blocks"
      },
      "value": {
        "ar": "6 مقاطع",
        "en": "6 blocks"
      }
    }
  },
  {
    "id": 13,
    "slug": "dashboard-13",
    "accent": "from-amber-500/25 via-emerald-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-emerald-500 to-amber-500",
      "accentText": "text-emerald-300"
    },
    "badge": {
      "ar": "اللوجستيات",
      "en": "Logistics"
    },
    "category": {
      "ar": "سلسلة الإمداد",
      "en": "Supply chain"
    },
    "title": {
      "ar": "لوحة سلسلة الإمداد",
      "en": "Supply chain command"
    },
    "summary": {
      "ar": "رؤية الشحنات، مخزون المستودعات، وتنبيهات الموردين عالميًا.",
      "en": "Global view of shipments, warehouse inventory, and supplier alerts."
    },
    "description": {
      "ar": "رؤية الشحنات، مخزون المستودعات، وتنبيهات الموردين عالميًا.",
      "en": "Global view of shipments, warehouse inventory, and supplier alerts."
    },
    "features": [
      {
        "ar": "خريطة التقدم اليومي",
        "en": "Daily shipment tracker"
      },
      {
        "ar": "بطاقات مستويات المخزون",
        "en": "Inventory health cards"
      },
      {
        "ar": "خط زمني للأحداث اللوجستية",
        "en": "Logistics updates timeline"
      }
    ],
    "metrics": {
      "label": {
        "ar": "عناصر لوجستية",
        "en": "Logistics widgets"
      },
      "value": {
        "ar": "6 عناصر",
        "en": "6 widgets"
      }
    }
  },
  {
    "id": 14,
    "slug": "dashboard-14",
    "accent": "from-emerald-500/25 via-lime-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-lime-500 to-emerald-400",
      "accentText": "text-emerald-400"
    },
    "badge": {
      "ar": "العقارات",
      "en": "Property"
    },
    "category": {
      "ar": "استثمار عقاري",
      "en": "Real estate investing"
    },
    "title": {
      "ar": "لوحة إدارة العقارات",
      "en": "Real estate portfolio dashboard"
    },
    "summary": {
      "ar": "مراقبة الإشغال، الإيرادات، وأعمال الصيانة عبر المحافظ.",
      "en": "Monitor occupancy, cashflow, and maintenance across property portfolios."
    },
    "description": {
      "ar": "مراقبة الإشغال، الإيرادات، وأعمال الصيانة عبر المحافظ.",
      "en": "Monitor occupancy, cashflow, and maintenance across property portfolios."
    },
    "features": [
      {
        "ar": "مخطط العوائد الشهرية",
        "en": "Monthly returns chart"
      },
      {
        "ar": "قائمة العقارات البارزة",
        "en": "Property spotlight list"
      },
      {
        "ar": "لوحة الصيانة والعمليات",
        "en": "Operations and upkeep board"
      }
    ],
    "metrics": {
      "label": {
        "ar": "قوالب استثمار",
        "en": "Investment tiles"
      },
      "value": {
        "ar": "6 بطاقات",
        "en": "6 tiles"
      }
    }
  },
  {
    "id": 15,
    "slug": "dashboard-15",
    "accent": "from-orange-500/30 via-rose-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-orange-500 to-amber-500",
      "accentText": "text-orange-300"
    },
    "badge": {
      "ar": "التصنيع",
      "en": "Manufacturing"
    },
    "category": {
      "ar": "عمليات المصانع",
      "en": "Factory operations"
    },
    "title": {
      "ar": "لوحة العمليات التصنيعية",
      "en": "Manufacturing operations dashboard"
    },
    "summary": {
      "ar": "تحليل الأداء، الجودة، والصيانة على خطوط الإنتاج.",
      "en": "Analyse performance, quality, and maintenance across production lines."
    },
    "description": {
      "ar": "تحليل الأداء، الجودة، والصيانة على خطوط الإنتاج.",
      "en": "Analyse performance, quality, and maintenance across production lines."
    },
    "features": [
      {
        "ar": "مخطط الإنتاج الفعلي",
        "en": "Actual vs plan production chart"
      },
      {
        "ar": "تنبيهات أعطال حرجة",
        "en": "Critical downtime alerts"
      },
      {
        "ar": "تقدم مبادرات التحسين",
        "en": "Improvement program tracker"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاطع تشغيلية",
        "en": "Operational blocks"
      },
      "value": {
        "ar": "6 وحدات",
        "en": "6 units"
      }
    }
  },
  {
    "id": 16,
    "slug": "dashboard-16",
    "accent": "from-purple-500/30 via-indigo-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-purple-500 to-indigo-500",
      "accentText": "text-indigo-300"
    },
    "badge": {
      "ar": "البث",
      "en": "Streaming"
    },
    "category": {
      "ar": "منصات المحتوى",
      "en": "Content platforms"
    },
    "title": {
      "ar": "لوحة منصة البث",
      "en": "Streaming service dashboard"
    },
    "summary": {
      "ar": "قياس المشتركين، أداء المحتوى، وصحة الشبكة لخدمة البث.",
      "en": "Measure subscribers, content performance, and network health for OTT."
    },
    "description": {
      "ar": "قياس المشتركين، أداء المحتوى، وصحة الشبكة لخدمة البث.",
      "en": "Measure subscribers, content performance, and network health for OTT."
    },
    "features": [
      {
        "ar": "نمو المشتركين",
        "en": "Subscriber growth cards"
      },
      {
        "ar": "لوحة أداء العناوين",
        "en": "Title performance board"
      },
      {
        "ar": "جودة التجربة التقنية",
        "en": "Experience quality metrics"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاطع وسائط",
        "en": "Media widgets"
      },
      "value": {
        "ar": "6 عناصر",
        "en": "6 widgets"
      }
    }
  },
  {
    "id": 17,
    "slug": "dashboard-17",
    "accent": "from-emerald-500/25 via-cyan-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-emerald-500 to-cyan-500",
      "accentText": "text-emerald-300"
    },
    "badge": {
      "ar": "المدن الذكية",
      "en": "Smart city"
    },
    "category": {
      "ar": "البنية الحضرية",
      "en": "Urban infrastructure"
    },
    "title": {
      "ar": "لوحة المدينة الذكية",
      "en": "Smart city operations"
    },
    "summary": {
      "ar": "إدارة التنقل، الطاقة، والاستدامة داخل المدينة الرقمية.",
      "en": "Manage mobility, energy, and sustainability across a digital city."
    },
    "description": {
      "ar": "إدارة التنقل، الطاقة، والاستدامة داخل المدينة الرقمية.",
      "en": "Manage mobility, energy, and sustainability across a digital city."
    },
    "features": [
      {
        "ar": "مؤشرات التنقل اليومي",
        "en": "Daily mobility indicators"
      },
      {
        "ar": "بطاقات الاستدامة",
        "en": "Sustainability scorecards"
      },
      {
        "ar": "خط زمني لمشاريع المدينة",
        "en": "City initiatives timeline"
      }
    ],
    "metrics": {
      "label": {
        "ar": "محاور حضرية",
        "en": "Urban modules"
      },
      "value": {
        "ar": "6 محاور",
        "en": "6 modules"
      }
    }
  },
  {
    "id": 18,
    "slug": "dashboard-18",
    "accent": "from-amber-500/25 via-rose-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-amber-500 to-rose-500",
      "accentText": "text-amber-300"
    },
    "badge": {
      "ar": "الضيافة",
      "en": "Hospitality"
    },
    "category": {
      "ar": "إدارة الفنادق",
      "en": "Hotel management"
    },
    "title": {
      "ar": "لوحة تجربة الضيافة",
      "en": "Hospitality experience dashboard"
    },
    "summary": {
      "ar": "مؤشرات الإشغال، رضا الضيوف، وجدولة الخدمات عبر ممتلكات الضيافة.",
      "en": "Occupancy, guest sentiment, and service schedules across hospitality assets."
    },
    "description": {
      "ar": "مؤشرات الإشغال، رضا الضيوف، وجدولة الخدمات عبر ممتلكات الضيافة.",
      "en": "Occupancy, guest sentiment, and service schedules across hospitality assets."
    },
    "features": [
      {
        "ar": "مخطط الأداء اليومي",
        "en": "Daily performance chart"
      },
      {
        "ar": "قائمة الفنادق الأعلى",
        "en": "Top property spotlight"
      },
      {
        "ar": "جدول مبادرات التجربة",
        "en": "Guest experience roadmap"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاطع ضيافة",
        "en": "Hospitality blocks"
      },
      "value": {
        "ar": "6 شرائح",
        "en": "6 blocks"
      }
    }
  },
  {
    "id": 19,
    "slug": "dashboard-19",
    "accent": "from-emerald-500/30 via-lime-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-emerald-500 to-lime-500",
      "accentText": "text-emerald-300"
    },
    "badge": {
      "ar": "الطاقة",
      "en": "Energy"
    },
    "category": {
      "ar": "الطاقة المتجددة",
      "en": "Renewables"
    },
    "title": {
      "ar": "لوحة الطاقة المتجددة",
      "en": "Renewable energy operations"
    },
    "summary": {
      "ar": "تشغيل محطات الطاقة النظيفة، موازنة الشبكة، ومشاريع الاستدامة.",
      "en": "Operate clean generation sites, balance the grid, and track sustainability."
    },
    "description": {
      "ar": "تشغيل محطات الطاقة النظيفة، موازنة الشبكة، ومشاريع الاستدامة.",
      "en": "Operate clean generation sites, balance the grid, and track sustainability."
    },
    "features": [
      {
        "ar": "مؤشرات توليد الطاقة",
        "en": "Generation KPI tiles"
      },
      {
        "ar": "مراقبة توازن الشبكة",
        "en": "Grid balance monitoring"
      },
      {
        "ar": "لوحة المبادرات الخضراء",
        "en": "Green initiatives board"
      }
    ],
    "metrics": {
      "label": {
        "ar": "عناصر الطاقة",
        "en": "Energy widgets"
      },
      "value": {
        "ar": "6 عناصر",
        "en": "6 widgets"
      }
    }
  },
  {
    "id": 20,
    "slug": "dashboard-20",
    "accent": "from-orange-500/25 via-rose-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-orange-500 to-rose-500",
      "accentText": "text-rose-300"
    },
    "badge": {
      "ar": "الرياضة",
      "en": "Sports"
    },
    "category": {
      "ar": "أندية محترفة",
      "en": "Pro clubs"
    },
    "title": {
      "ar": "لوحة إدارة الرياضة",
      "en": "Sports management analytics"
    },
    "summary": {
      "ar": "نتائج المباريات، جاهزية اللاعبين، وتفاعل الجماهير طوال الموسم.",
      "en": "Match outcomes, player readiness, and fan engagement across the season."
    },
    "description": {
      "ar": "نتائج المباريات، جاهزية اللاعبين، وتفاعل الجماهير طوال الموسم.",
      "en": "Match outcomes, player readiness, and fan engagement across the season."
    },
    "features": [
      {
        "ar": "تحليلات المباريات",
        "en": "Match analytics"
      },
      {
        "ar": "لوحة صحة اللاعبين",
        "en": "Player wellness board"
      },
      {
        "ar": "مؤشرات جماهيرية مباشرة",
        "en": "Live fan engagement KPIs"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاطع رياضية",
        "en": "Sports modules"
      },
      "value": {
        "ar": "6 شرائح",
        "en": "6 modules"
      }
    }
  },
  {
    "id": 21,
    "slug": "dashboard-21",
    "accent": "from-emerald-500/30 via-sky-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-emerald-500 to-sky-500",
      "accentText": "text-emerald-300"
    },
    "badge": {
      "ar": "الذكاء الاصطناعي",
      "en": "AI Ops"
    },
    "category": {
      "ar": "قيادة العمليات",
      "en": "Operations leadership"
    },
    "title": {
      "ar": "لوحة الذكاء التشغيلي",
      "en": "Operational intelligence cockpit"
    },
    "summary": {
      "ar": "تحليلات تنبؤية لمراقبة الأداء التشغيلي في الوقت الفعلي.",
      "en": "Predictive analytics to supervise operational performance in real time."
    },
    "description": {
      "ar": "منصة موحدة للجودة، الإنتاجية، وتنبيهات الانحراف المدعومة بالذكاء الاصطناعي.",
      "en": "A unified hub for quality, productivity, and AI-driven deviation alerts."
    },
    "features": [
      {
        "ar": "لوحة تنبيهات ذكية",
        "en": "AI-powered alerting panel"
      },
      {
        "ar": "مخطط الإنتاج مقابل الخطة",
        "en": "Actual vs plan throughput chart"
      },
      {
        "ar": "متابعة مبادرات الكفاءة",
        "en": "Efficiency initiative tracker"
      }
    ],
    "metrics": {
      "label": {
        "ar": "وحدات ذكية",
        "en": "Intelligence widgets"
      },
      "value": {
        "ar": "6 وحدات",
        "en": "6 widgets"
      }
    }
  },
  {
    "id": 22,
    "slug": "dashboard-22",
    "accent": "from-rose-500/30 via-indigo-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-rose-500 to-indigo-500",
      "accentText": "text-rose-300"
    },
    "badge": {
      "ar": "الوسائط",
      "en": "Media"
    },
    "category": {
      "ar": "تخطيط الحملات",
      "en": "Campaign planning"
    },
    "title": {
      "ar": "لوحة تخطيط الوسائط المتقدمة",
      "en": "Advanced media planning dashboard"
    },
    "summary": {
      "ar": "إدارة الميزانيات متعددة المنصات بتنبؤات دقيقة للنتائج.",
      "en": "Manage cross-platform budgets with accurate outcome forecasts."
    },
    "description": {
      "ar": "تحكم في الإنفاق، تخصيص القنوات، وتأثير الإعلانات الإبداعية عبر منصة واحدة.",
      "en": "Control spend, channel mix, and creative impact from one orchestrated hub."
    },
    "features": [
      {
        "ar": "مؤشر كفاءة الميزانية",
        "en": "Budget efficiency index"
      },
      {
        "ar": "مصفوفة توزيع القنوات",
        "en": "Channel allocation matrix"
      },
      {
        "ar": "حرارة أداء الإعلانات",
        "en": "Creative performance heatmap"
      }
    ],
    "metrics": {
      "label": {
        "ar": "تقارير وسائط",
        "en": "Media reports"
      },
      "value": {
        "ar": "5 تقارير",
        "en": "5 reports"
      }
    }
  },
  {
    "id": 23,
    "slug": "dashboard-23",
    "accent": "from-sky-500/30 via-indigo-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-sky-500 to-indigo-500",
      "accentText": "text-sky-300"
    },
    "badge": {
      "ar": "الرعاية الرقمية",
      "en": "Telehealth"
    },
    "category": {
      "ar": "شبكات طبية",
      "en": "Healthcare networks"
    },
    "title": {
      "ar": "لوحة شبكة الرعاية الافتراضية",
      "en": "Virtual care network dashboard"
    },
    "summary": {
      "ar": "متابعة جلسات الرعاية عن بعد والامتثال السريري وتجربة المرضى.",
      "en": "Track telehealth sessions, clinical compliance, and patient experience."
    },
    "description": {
      "ar": "لوحة شاملة لجداول الأطباء، رضا المرضى، وإدارة بروتوكولات الرعاية عن بعد.",
      "en": "A comprehensive board for provider schedules, patient sentiment, and telecare protocols."
    },
    "features": [
      {
        "ar": "جدول جلسات مباشر",
        "en": "Live session scheduler"
      },
      {
        "ar": "مؤشرات رضا المرضى",
        "en": "Patient satisfaction indicators"
      },
      {
        "ar": "لوحة الامتثال السريري",
        "en": "Clinical compliance board"
      }
    ],
    "metrics": {
      "label": {
        "ar": "مقاييس رعاية",
        "en": "Care metrics"
      },
      "value": {
        "ar": "6 عناصر",
        "en": "6 metrics"
      }
    }
  },
  {
    "id": 24,
    "slug": "dashboard-24",
    "accent": "from-amber-500/30 via-slate-700/20 to-slate-900/70",
    "preview": {
      "gradient": "from-amber-500 to-slate-600",
      "accentText": "text-amber-300"
    },
    "badge": {
      "ar": "الامتثال",
      "en": "Compliance"
    },
    "category": {
      "ar": "الخدمات المالية",
      "en": "Financial services"
    },
    "title": {
      "ar": "لوحة الامتثال المالي",
      "en": "Financial compliance monitor"
    },
    "summary": {
      "ar": "مراقبة الضوابط التنظيمية ومخاطر الامتثال لحظة بلحظة.",
      "en": "Monitor regulatory controls and compliance risk at a glance."
    },
    "description": {
      "ar": "تتبّع الضوابط، اختبارات KYC، وإنذارات المخاطر عبر فرق الامتثال العالمية.",
      "en": "Track controls, KYC testing, and risk alerts across global compliance teams."
    },
    "features": [
      {
        "ar": "لوحة اختبارات KYC",
        "en": "KYC testing board"
      },
      {
        "ar": "مؤشرات المخاطر الفورية",
        "en": "Real-time risk indicators"
      },
      {
        "ar": "سجل إجراءات التدقيق",
        "en": "Audit action log"
      }
    ],
    "metrics": {
      "label": {
        "ar": "ضوابط مراقبة",
        "en": "Control checks"
      },
      "value": {
        "ar": "7 ضوابط",
        "en": "7 checks"
      }
    }
  },
  {
    "id": 25,
    "slug": "dashboard-25",
    "accent": "from-emerald-500/25 via-lime-500/20 to-slate-900/70",
    "preview": {
      "gradient": "from-emerald-500 to-lime-500",
      "accentText": "text-emerald-300"
    },
    "badge": {
      "ar": "الاستدامة",
      "en": "Sustainability"
    },
    "category": {
      "ar": "تحليلات المناخ",
      "en": "Climate analytics"
    },
    "title": {
      "ar": "لوحة الاستدامة المناخية",
      "en": "Climate sustainability dashboard"
    },
    "summary": {
      "ar": "تحليل البصمة الكربونية والتقدم نحو أهداف صافي الصفر.",
      "en": "Analyse carbon footprint and progress toward net-zero targets."
    },
    "description": {
      "ar": "عرض انبعاثات النطاقات، مشاريع التعويض، وأداء المبادرات الخضراء.",
      "en": "Visualise scope emissions, offset projects, and green initiative performance."
    },
    "features": [
      {
        "ar": "مؤشرات الانبعاثات حسب النطاق",
        "en": "Scope-based emission tiles"
      },
      {
        "ar": "مخطط التقدم نحو صافي الصفر",
        "en": "Net-zero progress chart"
      },
      {
        "ar": "لوحة مبادرات الاستدامة",
        "en": "Sustainability initiative board"
      }
    ],
    "metrics": {
      "label": {
        "ar": "تقارير بيئية",
        "en": "Environmental reports"
      },
      "value": {
        "ar": "5 تقارير",
        "en": "5 reports"
      }
    }
  }
] as const satisfies readonly DashboardDefinition[];

export type DashboardCatalog = typeof DASHBOARD_CATALOG;
export type DashboardSlug = DashboardCatalog[number]['slug'];
