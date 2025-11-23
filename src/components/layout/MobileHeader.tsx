import { MobileSidebar } from "./MobileSidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
      <MobileSidebar />
      <div className="flex-1 font-semibold text-lg truncate">
        IA Primeros Auxilios
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificaciones</span>
      </Button>
    </header>
  );
}
