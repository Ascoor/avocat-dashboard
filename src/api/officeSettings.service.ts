import api from '@/api/axiosConfig';

export interface ExpenseCategory {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseCategoryInput {
  name: string;
}

export type LogoVariant = 'primary' | 'dark' | 'light' | 'icon';

export interface OfficeThemeConfig {
  light: {
    primary: string;
    surface: string;
    accent: string;
  };
  dark: {
    primary: string;
    surface: string;
    accent: string;
  };
}

export interface OfficeBrandingSettings {
  officeName: string;
  logos: Record<LogoVariant, { url: string | null; updated_at?: string | null } | undefined>;
  theme: OfficeThemeConfig;
  updated_at?: string;
}

const extractCollection = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) {
    if (raw.length === 1 && Array.isArray(raw[0])) {
      return raw[0] as T[];
    }

    if (raw.every((item) => typeof item === 'object' || typeof item === 'string')) {
      return raw as T[];
    }
  }

  if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    if (Array.isArray(record.data)) {
      return record.data as T[];
    }
    if (Array.isArray(record.items)) {
      return record.items as T[];
    }
  }

  return [];
};

const extractBrandingSettings = (raw: unknown): OfficeBrandingSettings => {
  if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    const theme = record.theme as OfficeThemeConfig | undefined;
    const officeName = typeof record.officeName === 'string' ? record.officeName : '';
    const logos = (record.logos as OfficeBrandingSettings['logos']) ?? {};

    return {
      officeName,
      logos: {
        primary: logos?.primary ?? { url: null },
        dark: logos?.dark ?? { url: null },
        light: logos?.light ?? { url: null },
        icon: logos?.icon ?? { url: null },
      },
      theme: {
        light: theme?.light ?? { primary: '#1E3A8A', surface: '#FFFFFF', accent: '#0EA5E9' },
        dark: theme?.dark ?? { primary: '#60A5FA', surface: '#0B1120', accent: '#FACC15' },
      },
      updated_at: typeof record.updated_at === 'string' ? record.updated_at : undefined,
    };
  }

  return {
    officeName: '',
    logos: {
      primary: { url: null },
      dark: { url: null },
      light: { url: null },
      icon: { url: null },
    },
    theme: {
      light: { primary: '#1E3A8A', surface: '#FFFFFF', accent: '#0EA5E9' },
      dark: { primary: '#60A5FA', surface: '#0B1120', accent: '#FACC15' },
    },
  };
};

export const getExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  const { data } = await api.get('/api/expense_categories');
  return extractCollection<ExpenseCategory>(data);
};

export const createExpenseCategory = async (payload: ExpenseCategoryInput) => {
  const { data } = await api.post('/api/expense_categories', payload);
  return data as ExpenseCategory;
};

export const updateExpenseCategory = async (id: number, payload: ExpenseCategoryInput) => {
  const { data } = await api.put(`/api/expense_categories/${id}`, payload);
  return data as ExpenseCategory;
};

export const deleteExpenseCategory = async (id: number) => {
  await api.delete(`/api/expense_categories/${id}`);
};

export const getOfficeBrandingSettings = async (): Promise<OfficeBrandingSettings> => {
  const { data } = await api.get('/api/office/branding');
  return extractBrandingSettings(data);
};

export const updateOfficeBrandingSettings = async (payload: FormData): Promise<OfficeBrandingSettings> => {
  const { data } = await api.post('/api/office/branding', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return extractBrandingSettings(data);
};

