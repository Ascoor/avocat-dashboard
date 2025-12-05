import { FC, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  title: string;
  time: string;
  priority: "high" | "medium" | "low";
  language: string;
  renderTaskIcon: (priority: string) => ReactNode;
}

const DashboardTaskItem: FC<Props> = ({ title, time, priority, language, renderTaskIcon }) => {
  const variant =
    priority === "high"
      ? "destructive"
      : priority === "medium"
      ? "default"
      : "secondary";

  const priorityLabel = () => {
    if (language === "ar") {
      if (priority === "high") return "عالي";
      if (priority === "medium") return "متوسط";
      return "منخفض";
    }
    return priority;
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card/60 p-3 hover:shadow">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
        {renderTaskIcon(priority)}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>

      <Badge variant={variant}>{priorityLabel()}</Badge>
    </div>
  );
};

export default DashboardTaskItem;
