// Mock data for all sections

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  agent?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  totalCases: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  clientsCount: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Case {
  id: string;
  title: string;
  client: string;
  lawyer: string;
  status: 'pending' | 'active' | 'closed' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  nextHearing?: string;
  value?: number;
}

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  activeCases: number;
  status: 'active' | 'inactive';
  licenseNumber: string;
}

export interface Session {
  id: string;
  caseId: string;
  caseTitle: string;
  date: string;
  type: 'hearing' | 'consultation' | 'mediation';
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  lawyer: string;
  court?: string;
  duration?: number;
}

export interface Procedure {
  id: string;
  caseId: string;
  caseTitle: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive';
  description: string;
}

// Mock data
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    email: 'ahmed.ali@email.com',
    phone: '+966501234567',
    agent: 'سارة أحمد',
    status: 'active',
    joinDate: '2024-01-15',
    totalCases: 3
  },
  {
    id: '2',
    name: 'فاطمة حسن',
    email: 'fatima.hassan@email.com',
    phone: '+966502345678',
    agent: 'محمد خالد',
    status: 'active',
    joinDate: '2024-02-10',
    totalCases: 1
  },
  {
    id: '3',
    name: 'خالد السعودي',
    email: 'khalid.saudi@email.com',
    phone: '+966503456789',
    status: 'inactive',
    joinDate: '2023-12-05',
    totalCases: 5
  },
  {
    id: '4',
    name: 'نورا الأحمد',
    email: 'nora.ahmad@email.com',
    phone: '+966504567890',
    agent: 'سارة أحمد',
    status: 'active',
    joinDate: '2024-03-01',
    totalCases: 2
  }
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'سارة أحمد',
    email: 'sara.ahmad@avocat.com',
    phone: '+966505678901',
    department: 'خدمة العملاء',
    clientsCount: 15,
    status: 'active',
    joinDate: '2023-06-01'
  },
  {
    id: '2',
    name: 'محمد خالد',
    email: 'mohammed.khalid@avocat.com',
    phone: '+966506789012',
    department: 'الدعم التقني',
    clientsCount: 12,
    status: 'active',
    joinDate: '2023-08-15'
  },
  {
    id: '3',
    name: 'نوال السعيد',
    email: 'nawal.saeed@avocat.com',
    phone: '+966507890123',
    department: 'خدمة العملاء',
    clientsCount: 8,
    status: 'inactive',
    joinDate: '2023-04-10'
  }
];

export const mockCases: Case[] = [
  {
    id: '1',
    title: 'قضية عقارية - نزاع ملكية',
    client: 'أحمد محمد علي',
    lawyer: 'د. عبدالله المحامي',
    status: 'active',
    priority: 'high',
    createdDate: '2024-01-20',
    nextHearing: '2024-02-15',
    value: 250000
  },
  {
    id: '2',
    title: 'قضية تجارية - مطالبة مالية',
    client: 'فاطمة حسن',
    lawyer: 'أ. نادية القانونية',
    status: 'pending',
    priority: 'medium',
    createdDate: '2024-02-01',
    value: 150000
  },
  {
    id: '3',
    title: 'قضية جنائية - تبرئة',
    client: 'خالد السعودي',
    lawyer: 'د. سعد المستشار',
    status: 'closed',
    priority: 'urgent',
    createdDate: '2023-11-15',
    nextHearing: undefined,
    value: 50000
  },
  {
    id: '4',
    title: 'قضية أسرية - حضانة',
    client: 'نورا الأحمد',
    lawyer: 'أ. ليلى المحامية',
    status: 'active',
    priority: 'high',
    createdDate: '2024-03-05',
    nextHearing: '2024-03-20'
  }
];

export const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'د. عبدالله المحامي',
    email: 'abdullah.lawyer@avocat.com',
    phone: '+966508901234',
    specialization: 'القانون العقاري',
    experience: 15,
    activeCases: 8,
    status: 'active',
    licenseNumber: 'LAW-2009-001'
  },
  {
    id: '2',
    name: 'أ. نادية القانونية',
    email: 'nadia.legal@avocat.com',
    phone: '+966509012345',
    specialization: 'القانون التجاري',
    experience: 12,
    activeCases: 6,
    status: 'active',
    licenseNumber: 'LAW-2012-045'
  },
  {
    id: '3',
    name: 'د. سعد المستشار',
    email: 'saad.consultant@avocat.com',
    phone: '+966501123456',
    specialization: 'القانون الجنائي',
    experience: 20,
    activeCases: 4,
    status: 'active',
    licenseNumber: 'LAW-2004-015'
  },
  {
    id: '4',
    name: 'أ. ليلى المحامية',
    email: 'layla.lawyer@avocat.com',
    phone: '+966502234567',
    specialization: 'قانون الأسرة',
    experience: 8,
    activeCases: 10,
    status: 'active',
    licenseNumber: 'LAW-2016-089'
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    caseId: '1',
    caseTitle: 'قضية عقارية - نزاع ملكية',
    date: '2024-02-15',
    type: 'hearing',
    status: 'scheduled',
    lawyer: 'د. عبدالله المحامي',
    court: 'المحكمة العامة - الرياض',
    duration: 120
  },
  {
    id: '2',
    caseId: '2',
    caseTitle: 'قضية تجارية - مطالبة مالية',
    date: '2024-02-10',
    type: 'consultation',
    status: 'completed',
    lawyer: 'أ. نادية القانونية',
    duration: 60
  },
  {
    id: '3',
    caseId: '4',
    caseTitle: 'قضية أسرية - حضانة',
    date: '2024-03-20',
    type: 'mediation',
    status: 'scheduled',
    lawyer: 'أ. ليلى المحامية',
    court: 'محكمة الأحوال الشخصية',
    duration: 90
  }
];

export const mockProcedures: Procedure[] = [
  {
    id: '1',
    caseId: '1',
    caseTitle: 'قضية عقارية - نزاع ملكية',
    type: 'تحضير المستندات',
    status: 'completed',
    assignedTo: 'د. عبدالله المحامي',
    dueDate: '2024-02-01',
    priority: 'high'
  },
  {
    id: '2',
    caseId: '2',
    caseTitle: 'قضية تجارية - مطالبة مالية',
    type: 'مراجعة العقود',
    status: 'in_progress',
    assignedTo: 'أ. نادية القانونية',
    dueDate: '2024-02-20',
    priority: 'medium'
  },
  {
    id: '3',
    caseId: '4',
    caseTitle: 'قضية أسرية - حضانة',
    type: 'جمع الأدلة',
    status: 'pending',
    assignedTo: 'أ. ليلى المحامية',
    dueDate: '2024-03-15',
    priority: 'high'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'استشارة قانونية',
    category: 'استشارات',
    price: 500,
    duration: '60 دقيقة',
    status: 'active',
    description: 'استشارة قانونية شاملة في جميع المجالات'
  },
  {
    id: '2',
    name: 'صياغة العقود',
    category: 'خدمات تجارية',
    price: 2000,
    duration: '3-5 أيام',
    status: 'active',
    description: 'صياغة ومراجعة العقود التجارية والمدنية'
  },
  {
    id: '3',
    name: 'تمثيل قضائي',
    category: 'تمثيل قانوني',
    price: 5000,
    duration: 'حسب القضية',
    status: 'active',
    description: 'تمثيل قانوني أمام المحاكم'
  },
  {
    id: '4',
    name: 'تسجيل شركة',
    category: 'خدمات تجارية',
    price: 3000,
    duration: '7-10 أيام',
    status: 'active',
    description: 'تسجيل الشركات والأعمال التجارية'
  }
];