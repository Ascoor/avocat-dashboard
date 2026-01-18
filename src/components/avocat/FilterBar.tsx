import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
  labelAr?: string;
}

interface FilterConfig {
  key: string;
  label: string;
  labelAr?: string;
  options: FilterOption[];
  placeholder?: string;
  placeholderAr?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchPlaceholderAr?: string;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

export const FilterBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchPlaceholderAr = 'بحث...',
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  className,
  actions,
}: FilterBarProps) => {
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const hasActiveFilters = Object.values(filterValues).some((v) => v && v !== 'all');

  return (
    <div className={cn(
      'flex flex-col gap-4 p-4 rounded-xl',
      'bg-card/50 border border-border/50',
      'backdrop-blur-sm',
      className
    )}>
      <div className={cn(
        'flex flex-wrap items-center gap-3',
        isRtl && 'flex-row-reverse'
      )}>
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
            isRtl ? 'right-3' : 'left-3'
          )} />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'ar' ? searchPlaceholderAr : searchPlaceholder}
            className={cn(
              'h-10',
              isRtl ? 'pr-10 text-right' : 'pl-10'
            )}
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filterValues[filter.key] || 'all'}
            onValueChange={(value) => onFilterChange?.(filter.key, value)}
          >
            <SelectTrigger className="w-[160px] h-10">
              <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue
                  placeholder={
                    language === 'ar' && filter.placeholderAr
                      ? filter.placeholderAr
                      : filter.placeholder || filter.label
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'ar' ? 'الكل' : 'All'}
              </SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {language === 'ar' && option.labelAr ? option.labelAr : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {language === 'ar' ? 'مسح' : 'Clear'}
          </Button>
        )}

        {/* Actions slot */}
        {actions && (
          <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
