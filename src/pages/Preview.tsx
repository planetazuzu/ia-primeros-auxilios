import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PreviewCard } from '@/components/PreviewCard';
import { ArrowLeft, Download, Github } from 'lucide-react';
import { ResourceFormData, ResourcePreview } from '@/types/resource';
import { generateMetadata } from '@/utils/generateMetadata';
import { slugify } from '@/utils/slugify';
import { buildZip, downloadZip } from '@/utils/zipBuilder';
import { toast } from 'sonner';

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<ResourcePreview | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const formData = location.state?.formData as ResourceFormData;
    
    if (!formData) {
      navigate('/upload');
      return;
    }

    // Generate metadata
    const metadata = generateMetadata({
      titulo: formData.titulo,
      autor: formData.autor,
      tipo: formData.tipo,
      idioma: formData.idioma,
      descripcion: formData.descripcion,
      fuentes: formData.fuentes,
    });

    // Determine folder
    const folderMap: Record<string, string> = {
      'protocolo': 'protocolos',
      'guia': 'guias',
      'infografia': 'infografias',
      'video': 'videos',
      'texto': 'textos',
      'enlace': 'enlaces',
    };

    const suggestedFolder = folderMap[formData.tipo] || 'otros';
    const suggestedFileName = formData.file 
      ? slugify(formData.file.name)
      : slugify(formData.titulo);

    const previewData: ResourcePreview = {
      titulo: formData.titulo,
      tipo: formData.tipo,
      metadata,
      suggestedFolder,
      suggestedFileName,
    };

    setPreview(previewData);

    // Generate ZIP
    const generateZipFile = async () => {
      try {
        const fileContent = formData.file 
          ? formData.file 
          : formData.enlace || formData.titulo;

        const zip = await buildZip({
          fileName: formData.titulo,
          fileContent,
          metadataContent: metadata,
          tipo: formData.tipo,
        });

        setZipBlob(zip);
      } catch (error) {
        console.error('Error generating ZIP:', error);
        toast.error('Error al generar el archivo ZIP');
      }
    };

    generateZipFile();
  }, [location, navigate]);

  const handleDownloadZip = () => {
    if (zipBlob && preview) {
      downloadZip(zipBlob, preview.titulo);
      toast.success('ZIP descargado correctamente');
    }
  };

  const handleSendToGithub = () => {
    if (!preview) return;
    
    const formData = location.state?.formData as ResourceFormData;
    if (!formData) {
      toast.error('Error: No se encontraron los datos del formulario');
      navigate('/upload');
      return;
    }
    
    // Navigate to progress page with preview data and form data
    navigate('/progress', { state: { preview, formData } });
  };

  if (!preview) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/upload')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al formulario
        </Button>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-3xl font-bold mb-2">Vista Previa del Recurso</h1>
              <p className="text-muted-foreground">
                Revisa la información antes de enviar al repositorio
              </p>
            </CardContent>
          </Card>

          <PreviewCard preview={preview} />

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadZip}
              disabled={!zipBlob}
              className="w-full"
            >
              <Download className="mr-2 h-5 w-5" />
              Descargar ZIP
            </Button>
            <Button
              size="lg"
              onClick={handleSendToGithub}
              className="w-full"
            >
              <Github className="mr-2 h-5 w-5" />
              Enviar al repositorio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
