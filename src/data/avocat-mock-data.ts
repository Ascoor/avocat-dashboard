// AVOCAT - Legal Case Management Mock Data

export interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  titleAr: string;
  client: string;
  clientAr: string;
  status: 'active' | 'pending' | 'closed' | 'on-hold' | 'urgent';
  priority: 'high' | 'medium' | 'low';
  type: string;
  typeAr: string;
  nextDeadline: string;
  assignedLawyer: string;
  assignedLawyerAr: string;
  createdAt: string;
  description?: string;
  descriptionAr?: string;
}

export interface TaskData {
  id: string;
  title: string;
  titleAr: string;
  caseId: string;
  caseName: string;
  caseNameAr: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done' | 'overdue';
  assignee: string;
  assigneeAr: string;
}

export interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'admin' | 'partner' | 'associate' | 'paralegal' | 'client-viewer';
  avatar?: string;
  department: string;
  departmentAr: string;
  caseCount: number;
  taskCount: number;
}

export interface DocumentData {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  caseId?: string;
  caseName?: string;
  tags: string[];
  securityLevel: 'confidential' | 'internal' | 'client-ready';
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  client: string;
  clientAr: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issuedDate: string;
  dueDate: string;
  caseId?: string;
}

export interface ActivityData {
  id: string;
  type: 'case-update' | 'document-upload' | 'invoice-issued' | 'task-completed' | 'session-scheduled';
  description: string;
  descriptionAr: string;
  timestamp: string;
  actor: string;
  actorAr: string;
  caseId?: string;
}

// Mock Cases
export const mockCases: CaseData[] = [
  {
    id: 'case-001',
    caseNumber: 'LEX-2024-001',
    title: 'Corporate Merger Dispute',
    titleAr: 'نزاع اندماج الشركات',
    client: 'Al-Rashid Holdings',
    clientAr: 'القابضة الراشد',
    status: 'active',
    priority: 'high',
    type: 'Corporate Law',
    typeAr: 'قانون الشركات',
    nextDeadline: '2024-02-15',
    assignedLawyer: 'Ahmed Al-Mansour',
    assignedLawyerAr: 'أحمد المنصور',
    createdAt: '2024-01-05',
    description: 'Dispute regarding merger terms and valuation',
    descriptionAr: 'نزاع حول شروط الاندماج والتقييم',
  },
  {
    id: 'case-002',
    caseNumber: 'LEX-2024-002',
    title: 'Employment Contract Review',
    titleAr: 'مراجعة عقد العمل',
    client: 'Tech Solutions Ltd',
    clientAr: 'تك سوليوشنز المحدودة',
    status: 'pending',
    priority: 'medium',
    type: 'Employment Law',
    typeAr: 'قانون العمل',
    nextDeadline: '2024-02-20',
    assignedLawyer: 'Sara Al-Fahad',
    assignedLawyerAr: 'سارة الفهد',
    createdAt: '2024-01-10',
  },
  {
    id: 'case-003',
    caseNumber: 'LEX-2024-003',
    title: 'Real Estate Acquisition',
    titleAr: 'استحواذ عقاري',
    client: 'Gulf Properties',
    clientAr: 'عقارات الخليج',
    status: 'active',
    priority: 'high',
    type: 'Real Estate',
    typeAr: 'العقارات',
    nextDeadline: '2024-02-10',
    assignedLawyer: 'Mohammed Al-Said',
    assignedLawyerAr: 'محمد السعيد',
    createdAt: '2024-01-08',
  },
  {
    id: 'case-004',
    caseNumber: 'LEX-2024-004',
    title: 'Intellectual Property Infringement',
    titleAr: 'انتهاك الملكية الفكرية',
    client: 'Innovation Corp',
    clientAr: 'شركة الابتكار',
    status: 'urgent',
    priority: 'high',
    type: 'IP Law',
    typeAr: 'قانون الملكية الفكرية',
    nextDeadline: '2024-02-05',
    assignedLawyer: 'Fatima Al-Zahrani',
    assignedLawyerAr: 'فاطمة الزهراني',
    createdAt: '2024-01-15',
  },
  {
    id: 'case-005',
    caseNumber: 'LEX-2024-005',
    title: 'Criminal Defense - Fraud Allegation',
    titleAr: 'دفاع جنائي - ادعاء احتيال',
    client: 'Private Client',
    clientAr: 'موكل خاص',
    status: 'active',
    priority: 'high',
    type: 'Criminal Law',
    typeAr: 'القانون الجنائي',
    nextDeadline: '2024-02-08',
    assignedLawyer: 'Khalid Al-Otaibi',
    assignedLawyerAr: 'خالد العتيبي',
    createdAt: '2024-01-12',
  },
  {
    id: 'case-006',
    caseNumber: 'LEX-2024-006',
    title: 'Family Settlement Agreement',
    titleAr: 'اتفاقية تسوية عائلية',
    client: 'Al-Hamad Family',
    clientAr: 'عائلة الحمد',
    status: 'pending',
    priority: 'medium',
    type: 'Family Law',
    typeAr: 'قانون الأسرة',
    nextDeadline: '2024-02-25',
    assignedLawyer: 'Nora Al-Sheikh',
    assignedLawyerAr: 'نورة الشيخ',
    createdAt: '2024-01-18',
  },
  {
    id: 'case-007',
    caseNumber: 'LEX-2024-007',
    title: 'Contract Negotiation - Supply Chain',
    titleAr: 'مفاوضات العقد - سلسلة التوريد',
    client: 'Global Trade Co',
    clientAr: 'التجارة العالمية',
    status: 'active',
    priority: 'medium',
    type: 'Commercial Law',
    typeAr: 'القانون التجاري',
    nextDeadline: '2024-02-18',
    assignedLawyer: 'Omar Al-Faisal',
    assignedLawyerAr: 'عمر الفيصل',
    createdAt: '2024-01-20',
  },
  {
    id: 'case-008',
    caseNumber: 'LEX-2024-008',
    title: 'Arbitration Proceedings',
    titleAr: 'إجراءات التحكيم',
    client: 'National Bank',
    clientAr: 'البنك الوطني',
    status: 'on-hold',
    priority: 'low',
    type: 'Arbitration',
    typeAr: 'التحكيم',
    nextDeadline: '2024-03-01',
    assignedLawyer: 'Ahmed Al-Mansour',
    assignedLawyerAr: 'أحمد المنصور',
    createdAt: '2024-01-22',
  },
  {
    id: 'case-009',
    caseNumber: 'LEX-2024-009',
    title: 'Insurance Claim Dispute',
    titleAr: 'نزاع مطالبة تأمين',
    client: 'Sunrise Industries',
    clientAr: 'صناعات الشروق',
    status: 'closed',
    priority: 'low',
    type: 'Insurance Law',
    typeAr: 'قانون التأمين',
    nextDeadline: '2024-01-30',
    assignedLawyer: 'Sara Al-Fahad',
    assignedLawyerAr: 'سارة الفهد',
    createdAt: '2024-01-02',
  },
  {
    id: 'case-010',
    caseNumber: 'LEX-2024-010',
    title: 'Construction Contract Breach',
    titleAr: 'خرق عقد البناء',
    client: 'BuildRight LLC',
    clientAr: 'بيلد رايت ذ.م.م',
    status: 'active',
    priority: 'high',
    type: 'Construction Law',
    typeAr: 'قانون البناء',
    nextDeadline: '2024-02-12',
    assignedLawyer: 'Mohammed Al-Said',
    assignedLawyerAr: 'محمد السعيد',
    createdAt: '2024-01-25',
  },
  {
    id: 'case-011',
    caseNumber: 'LEX-2024-011',
    title: 'Tax Compliance Review',
    titleAr: 'مراجعة الامتثال الضريبي',
    client: 'Export Masters',
    clientAr: 'أساتذة التصدير',
    status: 'pending',
    priority: 'medium',
    type: 'Tax Law',
    typeAr: 'قانون الضرائب',
    nextDeadline: '2024-02-28',
    assignedLawyer: 'Fatima Al-Zahrani',
    assignedLawyerAr: 'فاطمة الزهراني',
    createdAt: '2024-01-28',
  },
  {
    id: 'case-012',
    caseNumber: 'LEX-2024-012',
    title: 'Environmental Permit Application',
    titleAr: 'طلب تصريح بيئي',
    client: 'Green Energy Ltd',
    clientAr: 'الطاقة الخضراء المحدودة',
    status: 'active',
    priority: 'medium',
    type: 'Environmental Law',
    typeAr: 'القانون البيئي',
    nextDeadline: '2024-02-22',
    assignedLawyer: 'Nora Al-Sheikh',
    assignedLawyerAr: 'نورة الشيخ',
    createdAt: '2024-01-30',
  },
];

// Mock Tasks
export const mockTasks: TaskData[] = [
  {
    id: 'task-001',
    title: 'Prepare merger documents',
    titleAr: 'إعداد وثائق الاندماج',
    caseId: 'case-001',
    caseName: 'Corporate Merger Dispute',
    caseNameAr: 'نزاع اندماج الشركات',
    dueDate: '2024-02-10',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Ahmed Al-Mansour',
    assigneeAr: 'أحمد المنصور',
  },
  {
    id: 'task-002',
    title: 'Review employment contracts',
    titleAr: 'مراجعة عقود العمل',
    caseId: 'case-002',
    caseName: 'Employment Contract Review',
    caseNameAr: 'مراجعة عقد العمل',
    dueDate: '2024-02-15',
    priority: 'medium',
    status: 'todo',
    assignee: 'Sara Al-Fahad',
    assigneeAr: 'سارة الفهد',
  },
  {
    id: 'task-003',
    title: 'Submit court filing',
    titleAr: 'تقديم ملف المحكمة',
    caseId: 'case-005',
    caseName: 'Criminal Defense - Fraud',
    caseNameAr: 'دفاع جنائي - احتيال',
    dueDate: '2024-02-05',
    priority: 'high',
    status: 'overdue',
    assignee: 'Khalid Al-Otaibi',
    assigneeAr: 'خالد العتيبي',
  },
  {
    id: 'task-004',
    title: 'Client meeting preparation',
    titleAr: 'إعداد اجتماع الموكل',
    caseId: 'case-003',
    caseName: 'Real Estate Acquisition',
    caseNameAr: 'استحواذ عقاري',
    dueDate: '2024-02-08',
    priority: 'high',
    status: 'todo',
    assignee: 'Mohammed Al-Said',
    assigneeAr: 'محمد السعيد',
  },
  {
    id: 'task-005',
    title: 'Draft settlement agreement',
    titleAr: 'صياغة اتفاقية التسوية',
    caseId: 'case-006',
    caseName: 'Family Settlement',
    caseNameAr: 'تسوية عائلية',
    dueDate: '2024-02-20',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'Nora Al-Sheikh',
    assigneeAr: 'نورة الشيخ',
  },
  {
    id: 'task-006',
    title: 'Research precedent cases',
    titleAr: 'البحث في القضايا السابقة',
    caseId: 'case-004',
    caseName: 'IP Infringement',
    caseNameAr: 'انتهاك الملكية الفكرية',
    dueDate: '2024-02-03',
    priority: 'high',
    status: 'done',
    assignee: 'Fatima Al-Zahrani',
    assigneeAr: 'فاطمة الزهراني',
  },
  {
    id: 'task-007',
    title: 'Negotiate contract terms',
    titleAr: 'التفاوض على شروط العقد',
    caseId: 'case-007',
    caseName: 'Supply Chain Contract',
    caseNameAr: 'عقد سلسلة التوريد',
    dueDate: '2024-02-14',
    priority: 'medium',
    status: 'todo',
    assignee: 'Omar Al-Faisal',
    assigneeAr: 'عمر الفيصل',
  },
  {
    id: 'task-008',
    title: 'Review construction documents',
    titleAr: 'مراجعة وثائق البناء',
    caseId: 'case-010',
    caseName: 'Construction Breach',
    caseNameAr: 'خرق عقد البناء',
    dueDate: '2024-02-09',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Mohammed Al-Said',
    assigneeAr: 'محمد السعيد',
  },
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-001',
    name: 'Ahmed Al-Mansour',
    nameAr: 'أحمد المنصور',
    email: 'ahmed.mansour@avocat.law',
    role: 'partner',
    department: 'Corporate Law',
    departmentAr: 'قانون الشركات',
    caseCount: 12,
    taskCount: 8,
  },
  {
    id: 'team-002',
    name: 'Sara Al-Fahad',
    nameAr: 'سارة الفهد',
    email: 'sara.fahad@avocat.law',
    role: 'associate',
    department: 'Employment Law',
    departmentAr: 'قانون العمل',
    caseCount: 8,
    taskCount: 15,
  },
  {
    id: 'team-003',
    name: 'Mohammed Al-Said',
    nameAr: 'محمد السعيد',
    email: 'mohammed.said@avocat.law',
    role: 'partner',
    department: 'Real Estate',
    departmentAr: 'العقارات',
    caseCount: 10,
    taskCount: 12,
  },
  {
    id: 'team-004',
    name: 'Fatima Al-Zahrani',
    nameAr: 'فاطمة الزهراني',
    email: 'fatima.zahrani@avocat.law',
    role: 'associate',
    department: 'Intellectual Property',
    departmentAr: 'الملكية الفكرية',
    caseCount: 6,
    taskCount: 10,
  },
  {
    id: 'team-005',
    name: 'Khalid Al-Otaibi',
    nameAr: 'خالد العتيبي',
    email: 'khalid.otaibi@avocat.law',
    role: 'partner',
    department: 'Criminal Law',
    departmentAr: 'القانون الجنائي',
    caseCount: 5,
    taskCount: 7,
  },
  {
    id: 'team-006',
    name: 'Nora Al-Sheikh',
    nameAr: 'نورة الشيخ',
    email: 'nora.sheikh@avocat.law',
    role: 'associate',
    department: 'Family Law',
    departmentAr: 'قانون الأسرة',
    caseCount: 9,
    taskCount: 14,
  },
  {
    id: 'team-007',
    name: 'Omar Al-Faisal',
    nameAr: 'عمر الفيصل',
    email: 'omar.faisal@avocat.law',
    role: 'associate',
    department: 'Commercial Law',
    departmentAr: 'القانون التجاري',
    caseCount: 7,
    taskCount: 11,
  },
  {
    id: 'team-008',
    name: 'Layla Al-Rashid',
    nameAr: 'ليلى الراشد',
    email: 'layla.rashid@avocat.law',
    role: 'paralegal',
    department: 'Litigation Support',
    departmentAr: 'دعم التقاضي',
    caseCount: 0,
    taskCount: 25,
  },
];

// Mock Documents
export const mockDocuments: DocumentData[] = [
  {
    id: 'doc-001',
    name: 'Merger Agreement Draft v3',
    nameAr: 'مسودة اتفاقية الاندماج - الإصدار 3',
    type: 'PDF',
    size: '2.4 MB',
    uploadedBy: 'Ahmed Al-Mansour',
    uploadedAt: '2024-02-01',
    caseId: 'case-001',
    caseName: 'Corporate Merger Dispute',
    tags: ['merger', 'agreement', 'draft'],
    securityLevel: 'confidential',
  },
  {
    id: 'doc-002',
    name: 'Employment Contract Template',
    nameAr: 'قالب عقد العمل',
    type: 'DOCX',
    size: '156 KB',
    uploadedBy: 'Sara Al-Fahad',
    uploadedAt: '2024-01-28',
    caseId: 'case-002',
    tags: ['template', 'employment', 'contract'],
    securityLevel: 'internal',
  },
  {
    id: 'doc-003',
    name: 'Property Deed Copy',
    nameAr: 'نسخة سند الملكية',
    type: 'PDF',
    size: '5.1 MB',
    uploadedBy: 'Mohammed Al-Said',
    uploadedAt: '2024-01-25',
    caseId: 'case-003',
    caseName: 'Real Estate Acquisition',
    tags: ['property', 'deed', 'legal'],
    securityLevel: 'confidential',
  },
  {
    id: 'doc-004',
    name: 'Court Filing Receipt',
    nameAr: 'إيصال تقديم المحكمة',
    type: 'PDF',
    size: '89 KB',
    uploadedBy: 'Khalid Al-Otaibi',
    uploadedAt: '2024-02-02',
    caseId: 'case-005',
    tags: ['court', 'filing', 'receipt'],
    securityLevel: 'client-ready',
  },
  {
    id: 'doc-005',
    name: 'IP Registration Certificate',
    nameAr: 'شهادة تسجيل الملكية الفكرية',
    type: 'PDF',
    size: '312 KB',
    uploadedBy: 'Fatima Al-Zahrani',
    uploadedAt: '2024-01-20',
    caseId: 'case-004',
    tags: ['IP', 'registration', 'certificate'],
    securityLevel: 'confidential',
  },
];

// Mock Invoices
export const mockInvoices: InvoiceData[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-0001',
    client: 'Al-Rashid Holdings',
    clientAr: 'القابضة الراشد',
    amount: 75000,
    currency: 'SAR',
    status: 'sent',
    issuedDate: '2024-01-15',
    dueDate: '2024-02-15',
    caseId: 'case-001',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-0002',
    client: 'Tech Solutions Ltd',
    clientAr: 'تك سوليوشنز المحدودة',
    amount: 15000,
    currency: 'SAR',
    status: 'paid',
    issuedDate: '2024-01-20',
    dueDate: '2024-02-20',
    caseId: 'case-002',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-0003',
    client: 'Gulf Properties',
    clientAr: 'عقارات الخليج',
    amount: 120000,
    currency: 'SAR',
    status: 'overdue',
    issuedDate: '2024-01-01',
    dueDate: '2024-01-31',
    caseId: 'case-003',
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2024-0004',
    client: 'Innovation Corp',
    clientAr: 'شركة الابتكار',
    amount: 45000,
    currency: 'SAR',
    status: 'draft',
    issuedDate: '2024-02-01',
    dueDate: '2024-03-01',
    caseId: 'case-004',
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2024-0005',
    client: 'Private Client',
    clientAr: 'موكل خاص',
    amount: 200000,
    currency: 'SAR',
    status: 'sent',
    issuedDate: '2024-01-25',
    dueDate: '2024-02-25',
    caseId: 'case-005',
  },
];

// Mock Activities
export const mockActivities: ActivityData[] = [
  {
    id: 'act-001',
    type: 'case-update',
    description: 'Updated case status to Active',
    descriptionAr: 'تحديث حالة القضية إلى نشطة',
    timestamp: '2024-02-02T14:30:00Z',
    actor: 'Ahmed Al-Mansour',
    actorAr: 'أحمد المنصور',
    caseId: 'case-001',
  },
  {
    id: 'act-002',
    type: 'document-upload',
    description: 'Uploaded Merger Agreement Draft v3',
    descriptionAr: 'تحميل مسودة اتفاقية الاندماج - الإصدار 3',
    timestamp: '2024-02-01T10:15:00Z',
    actor: 'Ahmed Al-Mansour',
    actorAr: 'أحمد المنصور',
    caseId: 'case-001',
  },
  {
    id: 'act-003',
    type: 'invoice-issued',
    description: 'Issued invoice INV-2024-0005 for SAR 200,000',
    descriptionAr: 'إصدار فاتورة INV-2024-0005 بمبلغ 200,000 ريال',
    timestamp: '2024-01-25T09:00:00Z',
    actor: 'System',
    actorAr: 'النظام',
    caseId: 'case-005',
  },
  {
    id: 'act-004',
    type: 'task-completed',
    description: 'Completed task: Research precedent cases',
    descriptionAr: 'إكمال المهمة: البحث في القضايا السابقة',
    timestamp: '2024-02-02T16:45:00Z',
    actor: 'Fatima Al-Zahrani',
    actorAr: 'فاطمة الزهراني',
    caseId: 'case-004',
  },
  {
    id: 'act-005',
    type: 'session-scheduled',
    description: 'Scheduled court session for Feb 8, 2024',
    descriptionAr: 'جدولة جلسة المحكمة ليوم 8 فبراير 2024',
    timestamp: '2024-01-30T11:30:00Z',
    actor: 'Khalid Al-Otaibi',
    actorAr: 'خالد العتيبي',
    caseId: 'case-005',
  },
];

// Dashboard Stats
export const dashboardStats = {
  activeCases: 47,
  urgentDeadlines: 8,
  openTasks: 23,
  outstandingInvoices: 285000,
  closedCasesThisMonth: 5,
  newClientsThisMonth: 12,
  billedHoursThisMonth: 342,
  revenueThisMonth: 180000,
};

// Chart Data
export const casesByStatusData = [
  { name: 'Active', nameAr: 'نشطة', value: 24, color: 'hsl(var(--legal-success-500))' },
  { name: 'Pending', nameAr: 'معلقة', value: 12, color: 'hsl(var(--legal-warning-500))' },
  { name: 'On Hold', nameAr: 'موقوفة', value: 6, color: 'hsl(var(--muted-foreground))' },
  { name: 'Closed', nameAr: 'مغلقة', value: 5, color: 'hsl(var(--primary))' },
];

export const deadlinesTimelineData = [
  { month: 'Jan', deadlines: 8 },
  { month: 'Feb', deadlines: 12 },
  { month: 'Mar', deadlines: 6 },
  { month: 'Apr', deadlines: 15 },
  { month: 'May', deadlines: 9 },
  { month: 'Jun', deadlines: 11 },
];

export const revenueData = [
  { month: 'Jan', revenue: 120000, billedHours: 280 },
  { month: 'Feb', revenue: 180000, billedHours: 342 },
  { month: 'Mar', revenue: 145000, billedHours: 310 },
  { month: 'Apr', revenue: 200000, billedHours: 380 },
  { month: 'May', revenue: 165000, billedHours: 325 },
  { month: 'Jun', revenue: 190000, billedHours: 360 },
];

export const workloadByTeamData = [
  { name: 'Ahmed', cases: 12, tasks: 8 },
  { name: 'Sara', cases: 8, tasks: 15 },
  { name: 'Mohammed', cases: 10, tasks: 12 },
  { name: 'Fatima', cases: 6, tasks: 10 },
  { name: 'Khalid', cases: 5, tasks: 7 },
  { name: 'Nora', cases: 9, tasks: 14 },
];
