export interface DashboardCase {
  id: string;
  title: string;
  client: string;
  category: string;
  status: 'active' | 'pending' | 'closed' | 'on_hold';
  revenue: number;
}

export interface DashboardClient {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface DashboardSession {
  id: string;
  title: string;
  client: string;
  date: string; // ISO date string
  status: 'scheduled' | 'completed' | 'canceled';
}

// Sample data to simulate API responses
const cases: DashboardCase[] = [
  { id: '1', title: 'Contract Dispute', client: 'Ahmed Ali', category: 'Civil', status: 'active', revenue: 5000 },
  { id: '2', title: 'Property Fraud', client: 'Sara Ibrahim', category: 'Criminal', status: 'pending', revenue: 3000 },
  { id: '3', title: 'Divorce Settlement', client: 'John Smith', category: 'Family', status: 'closed', revenue: 2000 },
  { id: '4', title: 'Corporate Merger', client: 'Global Corp', category: 'Corporate', status: 'active', revenue: 12000 },
  { id: '5', title: 'Tax Evasion', client: 'Wealthy LLC', category: 'Tax', status: 'on_hold', revenue: 8000 }
];

const clients: DashboardClient[] = [
  { id: '1', name: 'Ahmed Ali', status: 'active' },
  { id: '2', name: 'Sara Ibrahim', status: 'active' },
  { id: '3', name: 'John Smith', status: 'inactive' },
  { id: '4', name: 'Global Corp', status: 'active' },
  { id: '5', name: 'Wealthy LLC', status: 'inactive' }
];

const sessions: DashboardSession[] = [
  { id: '1', title: 'Contract Review', client: 'Ahmed Ali', date: '2024-11-15', status: 'scheduled' },
  { id: '2', title: 'Court Hearing', client: 'Sara Ibrahim', date: '2024-11-18', status: 'scheduled' },
  { id: '3', title: 'Mediation', client: 'John Smith', date: '2024-11-20', status: 'completed' },
  { id: '4', title: 'Consultation', client: 'Global Corp', date: '2024-12-01', status: 'canceled' },
  { id: '5', title: 'Tax Meeting', client: 'Wealthy LLC', date: '2024-12-05', status: 'scheduled' }
];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Case = {
  async list(): Promise<DashboardCase[]> {
    await delay(200);
    return cases;
  }
};

export const Client = {
  async list(): Promise<DashboardClient[]> {
    await delay(200);
    return clients;
  }
};

export const Session = {
  async list(): Promise<DashboardSession[]> {
    await delay(200);
    return sessions;
  }
};

export interface DashboardStats {
  clients: number;
  cases: number;
  sessions: number;
  services: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(200);
  return {
    clients: 120,
    cases: 80,
    sessions: 45,
    services: 12,
  };
}
