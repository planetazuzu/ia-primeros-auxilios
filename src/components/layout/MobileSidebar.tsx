import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Upload, FolderOpen, Github } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 text-left border-b">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">✚</span> IA Primeros Auxilios
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-4">
          <div className="px-4 py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Navegación
            </h3>
            <div className="space-y-1">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleNavigation("/")}
              >
                <Home className="mr-2 h-5 w-5" />
                Inicio
              </Button>
              <Button
                variant={isActive("/recursos") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleNavigation("/recursos")}
              >
                <FolderOpen className="mr-2 h-5 w-5" />
                Explorar Recursos
              </Button>
              <Button
                variant={isActive("/upload") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleNavigation("/upload")}
              >
                <Upload className="mr-2 h-5 w-5" />
                Contribuir
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="px-4 py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Enlaces Externos
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => window.open("https://github.com/planetazuzu/ia-primeros-auxilios", "_blank")}
              >
                <Github className="mr-2 h-5 w-5" />
                Repositorio GitHub
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
