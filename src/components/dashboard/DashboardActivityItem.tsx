import { FC, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  title: string;
  description: string;
  time: string;
  status: string;
  type: string;
  language: string;
  renderActivityIcon: (type: string) => ReactNode;
  getActivityStatusVariant: (status: string) => string;
  getActivityStatusLabel: (status: string) => string;
}

const DashboardActivityItem: FC<Props> = ({
  title,
  description,
  time,
  status,
  type,
  language,
  renderActivityIcon,
  getActivityStatusVariant,
  getActivityStatusLabel,
}) => (
  <div className="flex items-start gap-3 rounded-xl border bg-card/60 p-3 hover:shadow">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
      {renderActivityIcon(type)}
    </div>

    <div className="flex-1 space-y-1">
      <div className="flex justify-between">
        <h4 className="font-semibold">{title}</h4>
        <Badge variant={getActivityStatusVariant(status)}>
          {getActivityStatusLabel(status)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground">
        {language === "ar" ? `الوقت: ${time}` : time}
      </p>
    </div>
  </div>
);

export default DashboardActivityItem;
