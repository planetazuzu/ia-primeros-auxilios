import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type StepStatus = 'pending' | 'loading' | 'success' | 'error';

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  error?: string;
}

interface ProgressModalProps {
  open: boolean;
  title: string;
  description?: string;
  steps: ProgressStep[];
}

export function ProgressModal({ open, title, description, steps }: ProgressModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.status === 'pending' && (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                {step.status === 'loading' && (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                )}
                {step.status === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                )}
                {step.status === 'error' && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step.label}</p>
                {step.error && (
                  <p className="text-xs text-destructive mt-1">{step.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
