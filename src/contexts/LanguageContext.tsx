import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    clients: 'العملاء',
    cases: 'القضايا',
    sessions: 'الجلسات',
    announcements: 'الإعلانات',
    lawyers: 'المحامون',
    settings: 'الإعدادات',
    
    // Landing Page
    heroTitle: 'نظام إدارة مكاتب المحاماة الأكثر تطوراً',
    heroSubtitle: 'أفوكات يوفر لك حلاً متكاملاً لإدارة قضاياك، عملائك، وجلساتك بكفاءة عالية واحترافية',
    getStarted: 'ابدأ الآن',
    requestDemo: 'طلب عرض توضيحي',
    whyAvocat: 'لماذا أفوكات؟',
    features: 'المميزات',
    testimonials: 'آراء العملاء',
    
    // Features
    caseManagement: 'إدارة القضايا',
    caseManagementDesc: 'نظام شامل لتتبع جميع قضاياك ومراحلها القانونية',
    clientManagement: 'إدارة العملاء',
    clientManagementDesc: 'قاعدة بيانات متكاملة لجميع عملائك وملفاتهم',
    sessionTracking: 'متابعة الجلسات',
    sessionTrackingDesc: 'تقويم ذكي لجدولة ومتابعة جميع الجلسات القانونية',
    documentManagement: 'إدارة المستندات',
    documentManagementDesc: 'حفظ وتنظيم جميع المستندات القانونية بشكل آمن',
    teamCollaboration: 'تعاون الفريق',
    teamCollaborationDesc: 'منصة موحدة للتواصل والتعاون بين أعضاء المكتب',
    reporting: 'التقارير والإحصائيات',
    reportingDesc: 'تقارير تفصيلية وإحصائيات دقيقة عن أداء المكتب',
    
    // Dashboard
    activeCases: 'القضايا النشطة',
    todaySessions: 'جلسات اليوم',
    overdueCases: 'قضايا متأخرة',
    activeClients: 'عملاء نشطون',
    upcomingSessions: 'الجلسات القادمة',
    casesByStatus: 'القضايا حسب الحالة',
    
    // Cases
    caseNumber: 'رقم القضية',
    caseTitle: 'عنوان القضية',
    client: 'العميل',
    opponent: 'الخصم',
    court: 'المحكمة',
    status: 'الحالة',
    stage: 'المرحلة',
    nextSession: 'الجلسة القادمة',
    lawyer: 'المحامي',
    actions: 'الإجراءات',
    
    // Status
    new: 'جديدة',
    inProgress: 'قيد الإجراء',
    pending: 'معلقة',
    closed: 'مغلقة',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    
    // Footer
    aboutSystem: 'عن النظام',
    contact: 'التواصل',
    terms: 'الشروط والأحكام',
    privacy: 'سياسة الخصوصية',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    clients: 'Clients',
    cases: 'Cases',
    sessions: 'Sessions',
    announcements: 'Announcements',
    lawyers: 'Lawyers',
    settings: 'Settings',
    
    // Landing Page
    heroTitle: 'The Most Advanced Law Firm Management System',
    heroSubtitle: 'Avocat provides you with a comprehensive solution to manage your cases, clients, and sessions with high efficiency and professionalism',
    getStarted: 'Get Started',
    requestDemo: 'Request Demo',
    whyAvocat: 'Why Avocat?',
    features: 'Features',
    testimonials: 'Testimonials',
    
    // Features
    caseManagement: 'Case Management',
    caseManagementDesc: 'Comprehensive system to track all your cases and legal stages',
    clientManagement: 'Client Management',
    clientManagementDesc: 'Integrated database for all your clients and their files',
    sessionTracking: 'Session Tracking',
    sessionTrackingDesc: 'Smart calendar to schedule and track all legal sessions',
    documentManagement: 'Document Management',
    documentManagementDesc: 'Securely store and organize all legal documents',
    teamCollaboration: 'Team Collaboration',
    teamCollaborationDesc: 'Unified platform for communication and collaboration between office members',
    reporting: 'Reports & Analytics',
    reportingDesc: 'Detailed reports and accurate statistics on office performance',
    
    // Dashboard
    activeCases: 'Active Cases',
    todaySessions: "Today's Sessions",
    overdueCases: 'Overdue Cases',
    activeClients: 'Active Clients',
    upcomingSessions: 'Upcoming Sessions',
    casesByStatus: 'Cases by Status',
    
    // Cases
    caseNumber: 'Case Number',
    caseTitle: 'Case Title',
    client: 'Client',
    opponent: 'Opponent',
    court: 'Court',
    status: 'Status',
    stage: 'Stage',
    nextSession: 'Next Session',
    lawyer: 'Lawyer',
    actions: 'Actions',
    
    // Status
    new: 'New',
    inProgress: 'In Progress',
    pending: 'Pending',
    closed: 'Closed',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    
    // Footer
    aboutSystem: 'About System',
    contact: 'Contact',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
