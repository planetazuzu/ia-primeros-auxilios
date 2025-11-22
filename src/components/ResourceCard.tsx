import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Video, 
  Image, 
  Book, 
  Link as LinkIcon, 
  ExternalLink, 
  Download,
  Edit,
  Calendar,
  Tag
} from 'lucide-react';
import { RepositoryFile } from '@/utils/github';
import { ParsedMetadata } from '@/utils/parseMarkdown';
import { formatDistanceToNow } from 'date-fns';

interface ResourceCardProps {
  file: RepositoryFile;
  metadata?: ParsedMetadata | null;
  onRequestChanges?: (file: RepositoryFile) => void;
}

export function ResourceCard({ file, metadata, onRequestChanges }: ResourceCardProps) {
  // Determinar tipo de recurso desde la ruta o metadata
  const getResourceType = (): string => {
    if (metadata?.tipo) return metadata.tipo;
    if (file.path.includes('/protocolos/')) return 'protocolo';
    if (file.path.includes('/guias/')) return 'guia';
    if (file.path.includes('/infografias/')) return 'infografia';
    if (file.path.includes('/videos/')) return 'video';
    if (file.path.includes('/documentos/')) return 'documento';
    if (file.path.includes('/templates/')) return 'template';
    if (file.path.includes('/textos/')) return 'texto';
    if (file.path.includes('/enlaces/')) return 'enlace';
    return 'otro';
  };

  const resourceType = getResourceType();

  // Obtener icono según tipo
  const getIcon = () => {
    switch (resourceType) {
      case 'protocolo':
        return <FileText className="h-5 w-5" />;
      case 'guia':
        return <Book className="h-5 w-5" />;
      case 'infografia':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'enlace':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Obtener color del badge según tipo
  const getTypeColor = (): string => {
    switch (resourceType) {
      case 'protocolo':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'guia':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'infografia':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'video':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'texto':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'enlace':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Título del recurso
  const title = metadata?.titulo || file.name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');

  // Descripción
  const description = metadata?.descripcion || 'Sin descripción disponible';

  // Formatear fecha
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Fecha desconocida';
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true
      });
    } catch {
      return dateString;
    }
  };

  // Formatear tamaño
  const formatSize = (bytes?: number): string => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // URL de GitHub
  const githubUrl = `https://github.com/${import.meta.env.VITE_GITHUB_OWNER || 'planetazuzu'}/${import.meta.env.VITE_GITHUB_REPO || 'ia-primeros-auxilios'}/blob/main/${file.path}`;

  return (
    <Card className="h-full flex flex-col hover-lift hover:shadow-xl glass-effect transition-all duration-300 bg-gradient-card border-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary/20 shadow-sm">
              {getIcon()}
            </div>
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
              {title}
            </CardTitle>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={getTypeColor()}>
            {resourceType}
          </Badge>
          {metadata?.tags && metadata.tags.length > 0 && (
            <>
              {metadata.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="bg-slate-800/50 text-slate-400 border-slate-700">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="text-slate-400 line-clamp-3 mb-4">
          {description}
        </CardDescription>
        
        <div className="flex flex-col gap-2 text-sm text-slate-500">
          {file.updatedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Actualizado {formatDate(file.updatedAt)}</span>
            </div>
          )}
          {file.size && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{formatSize(file.size)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
        {file.downloadUrl && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            asChild
          >
            <a href={file.downloadUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </a>
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="flex-1 bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          asChild
        >
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver en GitHub
          </a>
        </Button>
        {onRequestChanges && (
          <Button
            size="sm"
            variant="outline"
            className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            onClick={() => onRequestChanges(file)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Solicitar cambios
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

