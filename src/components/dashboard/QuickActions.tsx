import { Button, type ButtonProps } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LegalIcon from "@/components/common/LegalIcon";
import { getIconDesign, type IconKey } from "@/config/iconography";

export interface Action {
  label: string;
  to: string;
  iconKey: IconKey; // <— مهم جداً
  variant?: ButtonProps["variant"];
}

export default function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((item) => {
        const design = getIconDesign(item.iconKey);

        return (
          <Button key={item.to} variant={item.variant} asChild>
            <Link to={item.to} className="flex items-center gap-3 rtl:flex-row-reverse">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: design.badgeGradient, boxShadow: design.shadow }}
              >
                <LegalIcon iconKey={item.iconKey} width={24} height={24} />
              </span>

              {item.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
