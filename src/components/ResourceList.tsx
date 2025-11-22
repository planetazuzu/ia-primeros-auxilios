import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Search } from 'lucide-react';
import { RepositoryFile } from '@/utils/github';

interface ResourceListProps {
  resources: RepositoryFile[];
  loading?: boolean;
}

export function ResourceList({ resources, loading }: ResourceListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileType = (path: string): string => {
    if (path.includes('/protocolos/')) return 'protocolo';
    if (path.includes('/guias/')) return 'guia';
    if (path.includes('/infografias/')) return 'infografia';
    if (path.includes('/videos/')) return 'video';
    if (path.includes('/documentos/')) return 'documento';
    if (path.includes('/templates/')) return 'template';
    if (path.includes('/textos/')) return 'texto';
    if (path.includes('/enlaces/')) return 'enlace';
    return 'otro';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recursos en el repositorio</CardTitle>
          <CardDescription>
            Explora los recursos educativos ya disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2">
            {filteredResources.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No se encontraron recursos
              </p>
            ) : (
              filteredResources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(resource.size)}
                      </p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {getFileType(resource.path)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 flex-shrink-0"
                    asChild
                  >
                    <a href={resource.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
