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
    // Navigation - Main
    dashboard: 'لوحة التحكم',
    cases: 'القضايا',
    services: 'الخدمات',
    system: 'النظام',
    
    // Services - Work Follow Up
    workFollowUp: 'متابعة العمل',
    sessions: 'الجلسات',
    procedures: 'الإجراءات',
    
    // Services - Customer Service
    customerService: 'خدمة العملاء',
    clients: 'العملاء',
    clientsNoAgency: 'عملاء بدون وكالة',
    archive: 'الأرشيف',
    courtSearch: 'بحث المحاكم',
    
    // Services - Site Management
    siteManagement: 'إدارة الموقع',
    sitePages: 'صفحات الموقع',
    team: 'فريق العمل',
    achievements: 'الإنجازات',
    siteSettings: 'إعدادات الموقع',
    
    // System
    settings: 'الإعدادات',
    officeSettings: 'إعدادات المكتب',
    courtSettings: 'إعدادات المحاكم',
    lawyers: 'المحامون',
    usersPermissions: 'المستخدمون والصلاحيات',
    announcements: 'الإعلانات',
    
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
    monthlySessions: 'الجلسات الشهرية',
    caseTypeDistribution: 'توزيع القضايا حسب النوع',
    monthlyPerformance: 'الأداء الشهري',
    closureRate: 'معدل إغلاق القضايا',
    scheduled: 'مجدولة',
    completed: 'مكتملة',
    won: 'ربح',
    lost: 'خسارة',
    settled: 'تسوية',
    rate: 'المعدل',
    
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
    
    // Case Types
    criminal: 'جنائي',
    commercial: 'تجاري',
    family: 'أسري',
    civil: 'مدني',
    labor: 'عمالي',
    
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
    viewDetails: 'عرض التفاصيل',
    total: 'الإجمالي',
    
    // Footer
    aboutSystem: 'عن النظام',
    contact: 'التواصل',
    terms: 'الشروط والأحكام',
    privacy: 'سياسة الخصوصية',
    
    // Months
    jan: 'يناير',
    feb: 'فبراير',
    mar: 'مارس',
    apr: 'أبريل',
    may: 'مايو',
    jun: 'يونيو',
    jul: 'يوليو',
    aug: 'أغسطس',
    sep: 'سبتمبر',
    oct: 'أكتوبر',
    nov: 'نوفمبر',
    dec: 'ديسمبر',
  },
  en: {
    // Navigation - Main
    dashboard: 'Dashboard',
    cases: 'Cases',
    services: 'Services',
    system: 'System',
    
    // Services - Work Follow Up
    workFollowUp: 'Work Follow-up',
    sessions: 'Sessions',
    procedures: 'Procedures',
    
    // Services - Customer Service
    customerService: 'Customer Service',
    clients: 'Clients',
    clientsNoAgency: 'Clients No Agency',
    archive: 'Archive',
    courtSearch: 'Court Search',
    
    // Services - Site Management
    siteManagement: 'Site Management',
    sitePages: 'Site Pages',
    team: 'Team',
    achievements: 'Achievements',
    siteSettings: 'Site Settings',
    
    // System
    settings: 'Settings',
    officeSettings: 'Office Settings',
    courtSettings: 'Court Settings',
    lawyers: 'Lawyers',
    usersPermissions: 'Users & Permissions',
    announcements: 'Announcements',
    
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
    monthlySessions: 'Monthly Sessions',
    caseTypeDistribution: 'Case Type Distribution',
    monthlyPerformance: 'Monthly Performance',
    closureRate: 'Case Closure Rate',
    scheduled: 'Scheduled',
    completed: 'Completed',
    won: 'Won',
    lost: 'Lost',
    settled: 'Settled',
    rate: 'Rate',
    
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
    
    // Case Types
    criminal: 'Criminal',
    commercial: 'Commercial',
    family: 'Family',
    civil: 'Civil',
    labor: 'Labor',
    
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
    viewDetails: 'View Details',
    total: 'Total',
    
    // Footer
    aboutSystem: 'About System',
    contact: 'Contact',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    
    // Months
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
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
