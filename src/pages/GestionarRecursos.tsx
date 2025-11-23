import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { RepositoryFile } from '@/utils/github';
import {
  requestResourceModification,
  requestResourceDeletion,
  requestResourceReclassification,
} from '@/utils/createIssue';
import { toast } from 'sonner';

export default function GestionarRecursos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<RepositoryFile | null>(
    location.state?.file || null
  );
  const [activeTab, setActiveTab] = useState<string>(
    location.state?.action === 'modificar' ? 'modificar' : 'modificar'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ type: string; issueUrl?: string } | null>(null);

  // Formulario de modificación
  const [modifyDescription, setModifyDescription] = useState('');
  const [modifyEmail, setModifyEmail] = useState('');

  // Formulario de eliminación
  const [deleteJustification, setDeleteJustification] = useState('');
  const [deleteEmail, setDeleteEmail] = useState('');

  // Formulario de reclasificación
  const [reclassTargetFolder, setReclassTargetFolder] = useState('');
  const [reclassJustification, setReclassJustification] = useState('');
  const [reclassEmail, setReclassEmail] = useState('');

  useEffect(() => {
    if (location.state?.action) {
      setActiveTab(location.state.action);
    }
  }, [location]);

  const handleModify = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo');
      return;
    }

    if (!modifyDescription.trim()) {
      toast.error('Por favor, describe el cambio solicitado');
      return;
    }

    setLoading(true);
    try {
      const result = await requestResourceModification(
        selectedFile.path,
        modifyDescription,
        modifyEmail || undefined
      );

      if (result.success) {
        setSuccess({ type: 'modificar', issueUrl: result.issueUrl });
        toast.success('Solicitud de modificación enviada exitosamente');
        // Limpiar formulario
        setModifyDescription('');
        setModifyEmail('');
      } else {
        toast.error(result.error || 'Error al crear la solicitud');
      }
    } catch (error: any) {
      toast.error('Error inesperado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo');
      return;
    }

    if (!deleteJustification.trim()) {
      toast.error('Por favor, proporciona una justificación');
      return;
    }

    setLoading(true);
    try {
      const result = await requestResourceDeletion(
        selectedFile.path,
        deleteJustification,
        deleteEmail || undefined
      );

      if (result.success) {
        setSuccess({ type: 'eliminar', issueUrl: result.issueUrl });
        toast.success('Solicitud de eliminación enviada exitosamente');
        // Limpiar formulario
        setDeleteJustification('');
        setDeleteEmail('');
      } else {
        toast.error(result.error || 'Error al crear la solicitud');
      }
    } catch (error: any) {
      toast.error('Error inesperado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReclassify = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo');
      return;
    }

    if (!reclassTargetFolder) {
      toast.error('Por favor, selecciona una carpeta destino');
      return;
    }

    if (!reclassJustification.trim()) {
      toast.error('Por favor, proporciona una justificación');
      return;
    }

    setLoading(true);
    try {
      const result = await requestResourceReclassification(
        selectedFile.path,
        reclassTargetFolder,
        reclassJustification,
        reclassEmail || undefined
      );

      if (result.success) {
        setSuccess({ type: 'reclasificar', issueUrl: result.issueUrl });
        toast.success('Solicitud de reclasificación enviada exitosamente');
        // Limpiar formulario
        setReclassTargetFolder('');
        setReclassJustification('');
        setReclassEmail('');
      } else {
        toast.error(result.error || 'Error al crear la solicitud');
      }
    } catch (error: any) {
      toast.error('Error inesperado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const folders = [
    { value: 'protocolos', label: 'Protocolos' },
    { value: 'guias', label: 'Guías' },
    { value: 'infografias', label: 'Infografías' },
    { value: 'videos', label: 'Videos' },
    { value: 'textos', label: 'Textos' },
    { value: 'enlaces', label: 'Enlaces' },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/recursos')}
          className="mb-6 pl-0 sm:pl-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Recursos
        </Button>

        <Card className="mb-6 bg-slate-900/50 border-slate-800">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-xl lg:text-2xl text-slate-100">📌 Gestionar Recursos</CardTitle>
            <CardDescription className="text-sm lg:text-base text-slate-400">
              Solicita cambios, eliminaciones o reclasificaciones de recursos mediante Issues de GitHub
            </CardDescription>
          </CardHeader>
          {selectedFile && (
            <CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
              <div className="bg-slate-800/50 rounded-lg p-3 lg:p-4 border border-slate-700 overflow-hidden">
                <p className="text-xs lg:text-sm text-slate-400 mb-1">Archivo seleccionado:</p>
                <p className="text-slate-100 font-mono text-xs lg:text-sm truncate" title={selectedFile.path}>{selectedFile.path}</p>
              </div>
            </CardContent>
          )}
        </Card>

        {success ? (
          <Card className="bg-green-900/20 border-green-500/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Solicitud enviada exitosamente
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Tu solicitud de {success.type} ha sido creada como un Issue en GitHub.
                  </p>
                  {success.issueUrl && (
                    <Button
                      variant="outline"
                      asChild
                      className="bg-slate-800/50 border-slate-700"
                    >
                      <a href={success.issueUrl} target="_blank" rel="noopener noreferrer">
                        Ver Issue en GitHub
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSuccess(null);
                      setSelectedFile(null);
                    }}
                    className="ml-2"
                  >
                    Crear otra solicitud
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="modificar">Modificar</TabsTrigger>
              <TabsTrigger value="eliminar">Eliminar</TabsTrigger>
              <TabsTrigger value="reclasificar">Reclasificar</TabsTrigger>
            </TabsList>

            {/* Tab: Modificar */}
            <TabsContent value="modificar">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Solicitar Modificación</CardTitle>
                  <CardDescription className="text-slate-400">
                    Describe los cambios que te gustaría ver en este recurso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="modify-desc" className="text-slate-300">
                      Descripción del cambio *
                    </Label>
                    <Textarea
                      id="modify-desc"
                      placeholder="Ej: Actualizar información sobre RCP, añadir nuevos pasos, corregir errores..."
                      value={modifyDescription}
                      onChange={(e) => setModifyDescription(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 min-h-[120px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modify-email" className="text-slate-300">
                      Email (opcional)
                    </Label>
                    <Input
                      id="modify-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={modifyEmail}
                      onChange={(e) => setModifyEmail(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <Button
                    onClick={handleModify}
                    disabled={loading || !selectedFile}
                    className="w-full bg-slate-800 hover:bg-slate-700"
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Eliminar */}
            <TabsContent value="eliminar">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Solicitar Eliminación</CardTitle>
                  <CardDescription className="text-slate-400">
                    Justifica por qué este recurso debería ser eliminado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-yellow-200">
                        Esta acción creará un Issue para revisión. El archivo no se eliminará automáticamente.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delete-just" className="text-slate-300">
                      Justificación *
                    </Label>
                    <Textarea
                      id="delete-just"
                      placeholder="Ej: Contenido desactualizado, información incorrecta, duplicado..."
                      value={deleteJustification}
                      onChange={(e) => setDeleteJustification(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 min-h-[120px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delete-email" className="text-slate-300">
                      Email (opcional)
                    </Label>
                    <Input
                      id="delete-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <Button
                    onClick={handleDelete}
                    disabled={loading || !selectedFile}
                    variant="destructive"
                    className="w-full"
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitud de Eliminación'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Reclasificar */}
            <TabsContent value="reclasificar">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Solicitar Reclasificación</CardTitle>
                  <CardDescription className="text-slate-400">
                    Mueve este recurso a otra categoría
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reclass-folder" className="text-slate-300">
                      Carpeta destino *
                    </Label>
                    <Select value={reclassTargetFolder} onValueChange={setReclassTargetFolder}>
                      <SelectTrigger
                        id="reclass-folder"
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                      >
                        <SelectValue placeholder="Selecciona una carpeta" />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.value} value={folder.value}>
                            {folder.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reclass-just" className="text-slate-300">
                      Justificación *
                    </Label>
                    <Textarea
                      id="reclass-just"
                      placeholder="Ej: Este recurso encaja mejor en la categoría de protocolos porque..."
                      value={reclassJustification}
                      onChange={(e) => setReclassJustification(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 min-h-[120px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reclass-email" className="text-slate-300">
                      Email (opcional)
                    </Label>
                    <Input
                      id="reclass-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={reclassEmail}
                      onChange={(e) => setReclassEmail(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <Button
                    onClick={handleReclassify}
                    disabled={loading || !selectedFile}
                    className="w-full bg-slate-800 hover:bg-slate-700"
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitud de Reclasificación'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!selectedFile && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-400 mb-4">
                No hay ningún archivo seleccionado. Ve a la página de Recursos y selecciona "Solicitar cambios" en un recurso.
              </p>
              <Button onClick={() => navigate('/recursos')} variant="outline">
                Ir a Recursos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

