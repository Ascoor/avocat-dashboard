import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  labelAr?: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyMessageAr?: string;
  className?: string;
  pageSize?: number;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  emptyMessageAr = 'لا توجد بيانات',
  className,
  pageSize = 10,
}: DataTableProps<T>) {
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-border/50 overflow-hidden', className)}>
        <div className="animate-pulse">
          <div className="h-12 bg-muted/50" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-t border-border/30 bg-card/50" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn(
        'rounded-xl border border-border/50 bg-card p-12',
        'flex flex-col items-center justify-center text-center',
        className
      )}>
        <div className="text-muted-foreground">
          {language === 'ar' ? emptyMessageAr : emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border/50 overflow-hidden bg-card', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                    isRtl ? 'text-right' : 'text-left',
                    column.headerClassName
                  )}
                >
                  {language === 'ar' && column.labelAr ? column.labelAr : column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, rowIndex) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.03, duration: 0.2 }}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-border/30 last:border-b-0',
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-muted/40'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-sm text-foreground',
                      isRtl ? 'text-right' : 'text-left',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item, rowIndex)
                      : String((item as Record<string, unknown>)[column.key as string] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={cn(
          'flex items-center justify-between px-4 py-3 border-t border-border/30 bg-muted/20',
          isRtl && 'flex-row-reverse'
        )}>
          <span className="text-sm text-muted-foreground">
            {language === 'ar'
              ? `صفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>
          <div className={cn('flex gap-2', isRtl && 'flex-row-reverse')}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
