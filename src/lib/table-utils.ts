import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface TableData<T = any> {
  id: string | number;
  [key: string]: any;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

// Sorting utilities
export const sortData = <T extends TableData>(
  data: T[],
  sortState: SortState
): T[] => {
  if (!sortState.column || !sortState.direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = a[sortState.column!];
    const bValue = b[sortState.column!];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortState.direction === 'asc' ? -1 : 1;
    if (bValue == null) return sortState.direction === 'asc' ? 1 : -1;

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortState.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle dates
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortState.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Convert to string for comparison
    const aStr = String(aValue);
    const bStr = String(bValue);
    return sortState.direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
};

// Export utilities
export const exportToExcel = async <T extends TableData>(
  data: T[],
  columns: TableColumn<T>[],
  filename: string = 'export'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  worksheet.columns = columns.map(col => ({
    header: col.title,
    key: String(col.key),
  }));

  data.forEach(item => {
    const row: Record<string, unknown> = {};

    columns.forEach(col => {
      const key = String(col.key);
      row[key] = (item as any)[col.key];
    });

    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, `${filename}.xlsx`);
};

export const exportToCSV = <T extends TableData>(
  data: T[],
  columns: TableColumn<T>[],
  filename: string = 'export'
) => {
  // Prepare headers
  const headers = columns.map(column => column.title);
  
  // Prepare rows
  const rows = data.map(item => 
    columns.map(column => {
      const value = item[column.key];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value || '');
    })
  );

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// Filter utilities
export const filterData = <T extends TableData>(
  data: T[],
  searchTerm: string,
  searchColumns?: (keyof T)[]
): T[] => {
  if (!searchTerm) return data;

  const term = searchTerm.toLowerCase();
  
  return data.filter(item => {
    const columnsToSearch = searchColumns || Object.keys(item) as (keyof T)[];
    
    return columnsToSearch.some(column => {
      const value = item[column];
      return String(value || '').toLowerCase().includes(term);
    });
  });
};

// Pagination utilities
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export const paginateData = <T extends TableData>(
  data: T[],
  pagination: PaginationState
): T[] => {
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return data.slice(start, end);
};

export const getTotalPages = (total: number, pageSize: number): number => {
  return Math.ceil(total / pageSize);
};