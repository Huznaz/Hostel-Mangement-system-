
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, iconColorClass = "bg-blue-100 text-blue-500" }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${iconColorClass}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
