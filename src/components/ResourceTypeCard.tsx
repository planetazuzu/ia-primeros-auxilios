import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResourceTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export function ResourceTypeCard({ 
  icon: Icon, 
  title, 
  description, 
  selected,
  onClick 
}: ResourceTypeCardProps) {
  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all hover:shadow-md hover:scale-105",
        "border-2",
        selected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-card hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={cn(
          "p-3 rounded-lg",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
}
