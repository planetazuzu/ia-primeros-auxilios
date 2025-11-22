import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Preview from "./pages/Preview";
import Progress from "./pages/Progress";
import Success from "./pages/Success";
import Repository from "./pages/Repository";
import Recursos from "./pages/Recursos";
import GestionarRecursos from "./pages/GestionarRecursos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/success" element={<Success />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/gestionar-recursos" element={<GestionarRecursos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
