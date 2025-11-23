import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ResourceTypeCard } from '@/components/ResourceTypeCard';
import { FileText, Image, Video, Link as LinkIcon, Book, FileBarChart, ArrowLeft } from 'lucide-react';
import { ResourceType, ResourceFormData } from '@/types/resource';
import { toast } from 'sonner';

const formSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  tipo: z.enum(['protocolo', 'guia', 'infografia', 'video', 'texto', 'enlace']),
  idioma: z.string().min(2),
  autor: z.string().optional(),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000),
  fuentes: z.string().optional(),
  file: z.any().optional(),
  enlace: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  acceptedLicense: z.boolean().refine(val => val === true, 'Debes aceptar la licencia'),
  acceptedEducational: z.boolean().refine(val => val === true, 'Debes confirmar el uso didáctico'),
  acceptedNoSensitiveData: z.boolean().refine(val => val === true, 'Debes confirmar que no hay datos sensibles'),
});

const resourceTypes = [
  { value: 'protocolo', icon: FileText, title: 'Protocolo', description: 'Procedimientos paso a paso' },
  { value: 'guia', icon: Book, title: 'Guía', description: 'Documentos educativos completos' },
  { value: 'infografia', icon: Image, title: 'Infografía', description: 'Contenido visual educativo' },
  { value: 'video', icon: Video, title: 'Video', description: 'Contenido audiovisual' },
  { value: 'texto', icon: FileBarChart, title: 'Texto', description: 'Artículos y documentos' },
  { value: 'enlace', icon: LinkIcon, title: 'Enlace', description: 'Recursos externos' },
];

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      tipo: 'protocolo',
      idioma: 'es',
      autor: '',
      descripcion: '',
      fuentes: '',
      enlace: '',
      acceptedLicense: false,
      acceptedEducational: false,
      acceptedNoSensitiveData: false,
    },
  });

  const watchedType = form.watch('tipo');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData: ResourceFormData = {
      titulo: data.titulo,
      tipo: data.tipo as ResourceType,
      idioma: data.idioma,
      autor: data.autor,
      descripcion: data.descripcion,
      fuentes: data.fuentes,
      file: selectedFile || undefined,
      enlace: data.enlace,
      acceptedLicense: data.acceptedLicense,
      acceptedEducational: data.acceptedEducational,
      acceptedNoSensitiveData: data.acceptedNoSensitiveData,
    };

    // Navigate to preview with form data
    navigate('/preview', { state: { formData } });
    toast.success('Formulario completado. Revisando vista previa...');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-2xl lg:text-3xl">Subir Recurso Educativo</CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Completa el formulario para contribuir con un recurso de primeros auxilios
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
                {/* Resource Type Selection */}
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base lg:text-lg font-semibold">Tipo de recurso *</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                        {resourceTypes.map((type) => (
                          <ResourceTypeCard
                            key={type.value}
                            icon={type.icon}
                            title={type.title}
                            description={type.description}
                            selected={field.value === type.value}
                            onClick={() => field.onChange(type.value)}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Protocolo de RCP básico" {...field} className="h-12 lg:h-10 text-base lg:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Language & Author */}
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                  <FormField
                    control={form.control}
                    name="idioma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Idioma *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 lg:h-10 text-base lg:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="pt">Português</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Autor/a (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre o anónimo" {...field} className="h-12 lg:h-10 text-base lg:text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File or Link */}
                {watchedType === 'enlace' ? (
                  <FormField
                    control={form.control}
                    name="enlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Enlace al recurso *</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://..." {...field} className="h-12 lg:h-10 text-base lg:text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-2">
                    <Label className="text-base">Archivo *</Label>
                    <Input
                      type="file"
                      accept={watchedType === 'video' ? 'video/*' : watchedType === 'infografia' ? 'image/*' : '.pdf,.doc,.docx'}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="h-12 lg:h-10 text-base lg:text-sm py-3 lg:py-2"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Archivo seleccionado: {selectedFile.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Descripción *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe el contenido del recurso..."
                          className="min-h-[120px] text-base lg:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sources */}
                <FormField
                  control={form.control}
                  name="fuentes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Fuentes (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Referencias, enlaces o fuentes del contenido..."
                          className="min-h-[80px] text-base lg:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirmations */}
                <div className="space-y-4 border border-border rounded-lg p-4 lg:p-6 bg-muted/30">
                  <h3 className="font-semibold text-foreground text-lg lg:text-base">Confirmaciones requeridas</h3>
                  
                  <FormField
                    control={form.control}
                    name="acceptedLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 lg:h-4 lg:w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal text-base lg:text-sm">
                            Acepto publicar este recurso bajo licencia <strong>CC BY-SA 4.0</strong>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptedEducational"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 lg:h-4 lg:w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal text-base lg:text-sm">
                            Confirmo que este recurso será usado exclusivamente con <strong>fines didácticos</strong>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptedNoSensitiveData"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 lg:h-4 lg:w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal text-base lg:text-sm">
                            Confirmo que este recurso <strong>no contiene datos sensibles</strong> ni información personal
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-12 lg:h-10 text-lg lg:text-base">
                  Generar recurso
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
