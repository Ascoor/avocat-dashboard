import { FC } from 'react';
 

import { AppCard } from '@/components/common/AppCard';

interface Props {
  title: string;
  value: string | number;
  description: string;
  icon: any;
    trend: string;
    trendColor?: string;
}

const DashboardStatCard: FC<Props> = ({ title, value, description, icon: Icon, trend, trendColor = "" }) => (
  <AppCard>
    <div className="flex items-start justify-between pb-2">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
        <div className="text-3xl font-bold text-brand-primary">{value}</div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="flex justify-between text-sm">
      <p className="text-muted-foreground">{description}</p>
      <span className={trendColor}>{trend}</span>
    </div>
  </AppCard>
);

export default DashboardStatCard;
