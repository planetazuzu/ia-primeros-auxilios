import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Folder } from 'lucide-react';
import { ResourcePreview } from '@/types/resource';

interface PreviewCardProps {
  preview: ResourcePreview;
}

export function PreviewCard({ preview }: PreviewCardProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {preview.titulo}
          </CardTitle>
          <CardDescription>Vista previa del recurso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{preview.tipo}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Folder className="h-4 w-4" />
              <span>{preview.suggestedFolder}/</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Nombre de archivo sugerido:</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {preview.suggestedFileName}
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metadata generada</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
            {preview.metadata}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
