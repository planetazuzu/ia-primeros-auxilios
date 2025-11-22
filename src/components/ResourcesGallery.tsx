import { useState, useMemo, useEffect } from 'react';
import { ResourceCard } from './ResourceCard';
import { RepositoryFile } from '@/utils/github';
import { ParsedMetadata } from '@/utils/parseMarkdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowUpDown, Grid, List } from 'lucide-react';

export type SortBy = 'fecha' | 'nombre' | 'tipo' | 'carpeta';
export type SortOrder = 'asc' | 'desc';

interface ResourcesGalleryProps {
  resources: Array<{
    file: RepositoryFile;
    metadata?: ParsedMetadata | null;
  }>;
  loading?: boolean;
  onRequestChanges?: (file: RepositoryFile) => void;
}

export function ResourcesGallery({ resources, loading, onRequestChanges }: ResourcesGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('fecha');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Función auxiliar para obtener tipo de recurso
  const getResourceType = (path: string): string => {
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

  // Filtrar recursos por búsqueda
  const filteredResources = useMemo(() => {
    return resources.filter(({ file, metadata }) => {
      const searchLower = searchTerm.toLowerCase();
      const title = metadata?.titulo || file.name;
      const description = metadata?.descripcion || '';
      const tags = metadata?.tags?.join(' ') || '';
      const type = getResourceType(file.path);
      
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        tags.toLowerCase().includes(searchLower) ||
        type.toLowerCase().includes(searchLower) ||
        file.name.toLowerCase().includes(searchLower)
      );
    });
  }, [resources, searchTerm]);

  // Ordenar recursos
  const sortedResources = useMemo(() => {
    const sorted = [...filteredResources];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'fecha':
          const dateA = a.file.updatedAt ? new Date(a.file.updatedAt).getTime() : 0;
          const dateB = b.file.updatedAt ? new Date(b.file.updatedAt).getTime() : 0;
          comparison = dateA - dateB;
          break;
        
        case 'nombre':
          const nameA = a.metadata?.titulo || a.file.name;
          const nameB = b.metadata?.titulo || b.file.name;
          comparison = nameA.localeCompare(nameB);
          break;
        
        case 'tipo':
          const typeA = getResourceType(a.file.path);
          const typeB = getResourceType(b.file.path);
          comparison = typeA.localeCompare(typeB);
          break;
        
        case 'carpeta':
          const folderA = a.file.path.split('/')[0] || '';
          const folderB = b.file.path.split('/')[0] || '';
          comparison = folderA.localeCompare(folderB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredResources, sortBy, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedResources.length / itemsPerPage);
  const paginatedResources = sortedResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles de búsqueda y ordenación */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100"
              />
            </div>

            {/* Ordenación */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-slate-100">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fecha">Fecha</SelectItem>
                  <SelectItem value="nombre">Nombre</SelectItem>
                  <SelectItem value="tipo">Tipo</SelectItem>
                  <SelectItem value="carpeta">Carpeta</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-slate-800/50 border-slate-700 text-slate-100 hover:bg-slate-700"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>

              {/* Vista */}
              <div className="flex border border-slate-700 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none bg-slate-800/50 hover:bg-slate-700"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none bg-slate-800/50 hover:bg-slate-700"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-sm text-slate-400">
            Mostrando {paginatedResources.length} de {sortedResources.length} recursos
          </div>
        </CardContent>
      </Card>

      {/* Grid de recursos */}
      {paginatedResources.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400">No se encontraron recursos</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
            }
          >
            {paginatedResources.map(({ file, metadata }) => (
              <ResourceCard
                key={file.path}
                file={file}
                metadata={metadata}
                onRequestChanges={onRequestChanges}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-400">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

