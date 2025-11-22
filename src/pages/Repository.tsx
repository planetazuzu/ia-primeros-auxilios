import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ResourceList } from '@/components/ResourceList';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { listAllResources, RepositoryFile } from '@/utils/github';
import { toast } from 'sonner';

export default function Repository() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<RepositoryFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);

    try {
      // Validar token
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token) {
        toast.error('Token de GitHub no configurado. Por favor, configura VITE_GITHUB_TOKEN en tu archivo .env');
        setLoading(false);
        return;
      }

      // Cargar recursos desde las carpetas de recursos educativos
      // Usa listAllResources() que lista solo: protocolos, guias, infografias, videos, textos, enlaces
      const result = await listAllResources();
      
      if (result.success && result.files) {
        // Filtrar archivos de documentación del proyecto (por seguridad adicional)
        const excludedFiles = [
          '.gitignore',
          'LICENSE',
          'README.md',
          'CONTRIBUTING.md',
          'GUIA_COLABORAR.md',
          '.git',
          'package.json',
          'package-lock.json',
        ];
        
        const files = result.files
          .filter(file => {
            // Excluir archivos de documentación del proyecto
            const fileName = file.name.toLowerCase();
            const isExcluded = excludedFiles.some(excluded => 
              fileName.includes(excluded.toLowerCase())
            );
            return !isExcluded;
          })
          .sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return dateB - dateA; // Más recientes primero
          });
        setResources(files);
        toast.success(`${files.length} recursos educativos cargados`);
      } else {
        toast.error(result.error || 'Error al cargar los recursos del repositorio');
      }
    } catch (error: any) {
      console.error('Error loading resources:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error inesperado al cargar recursos';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button
            variant="outline"
            onClick={loadResources}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">Repositorio de Recursos</h1>
            <p className="text-muted-foreground">
              Explora todos los recursos educativos de primeros auxilios disponibles
            </p>
          </CardContent>
        </Card>

        <ResourceList resources={resources} loading={loading} />
      </div>
    </div>
  );
}
