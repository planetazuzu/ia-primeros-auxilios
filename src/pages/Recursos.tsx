import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ResourcesGallery } from '@/components/ResourcesGallery';
import { ArrowLeft, RefreshCw, BookOpen } from 'lucide-react';
import { listAllResources, RepositoryFile, githubListRepositoryFiles } from '@/utils/github';
import { fetchMarkdownMetadata, ParsedMetadata } from '@/utils/parseMarkdown';
import { toast } from 'sonner';

export default function Recursos() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Array<{
    file: RepositoryFile;
    metadata?: ParsedMetadata | null;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllResources();
  }, []);

  const loadAllResources = async () => {
    setLoading(true);

    try {
      // Validar token
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token) {
        toast.error('Token de GitHub no configurado. Por favor, configura VITE_GITHUB_TOKEN en tu archivo .env');
        setLoading(false);
        return;
      }

      // Cargar todos los recursos
      const result = await listAllResources();
      
      if (result.success && result.files) {
        // Cargar metadata para cada archivo
        const resourcesWithMetadata = await Promise.all(
          result.files.map(async (file) => {
            // Construir ruta del archivo .md correspondiente
            const mdPath = file.path.replace(/\.[^/.]+$/, '') + '.md';
            
            // Obtener el archivo .md directamente desde GitHub
            let metadata: ParsedMetadata | null = null;
            
            try {
              // Extraer carpeta del path
              const folder = file.path.split('/')[0];
              const mdFileName = mdPath.split('/').pop() || '';
              
              // Listar archivos de la carpeta para encontrar el .md
              const folderResult = await githubListRepositoryFiles(folder);
              if (folderResult.success && folderResult.files) {
                const mdFile = folderResult.files.find(f => f.name === mdFileName && f.type === 'file');
                
                if (mdFile?.downloadUrl) {
                  try {
                    metadata = await fetchMarkdownMetadata(mdFile.downloadUrl);
                  } catch (error) {
                    console.warn(`No se pudo cargar metadata para ${file.path}:`, error);
                  }
                }
              }
            } catch (error) {
              // Si no se encuentra el .md, continuar sin metadata
              console.warn(`No se encontró metadata para ${file.path}`);
            }
            
            return { file, metadata };
          })
        );
        
        setResources(resourcesWithMetadata);
        toast.success(`${resourcesWithMetadata.length} recursos cargados`);
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

  const handleRequestChanges = (file: RepositoryFile) => {
    // Navegar a la página de gestión con el archivo seleccionado
    navigate('/gestionar-recursos', { 
      state: { 
        action: 'modificar',
        file 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="pl-0 sm:pl-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button
            variant="outline"
            onClick={loadAllResources}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <Card className="mb-6 bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-slate-300" />
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-100">Recursos Subidos</h1>
            </div>
            <p className="text-sm lg:text-base text-slate-400">
              Explora todos los recursos educativos de primeros auxilios disponibles en el repositorio
            </p>
          </CardContent>
        </Card>

        <ResourcesGallery
          resources={resources}
          loading={loading}
          onRequestChanges={handleRequestChanges}
        />
      </div>
    </div>
  );
}

