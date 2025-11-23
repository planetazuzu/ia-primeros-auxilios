import { MobileHeader } from "./MobileHeader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Mobile Header - Visible only on mobile */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      <Toaster />
      <Sonner />
    </div>
  );
}
