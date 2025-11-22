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
          <CardHeader>
            <CardTitle className="text-3xl">Subir Recurso Educativo</CardTitle>
            <CardDescription>
              Completa el formulario para contribuir con un recurso de primeros auxilios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Resource Type Selection */}
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Tipo de recurso *</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Protocolo de RCP básico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Language & Author */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="idioma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Autor/a (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre o anónimo" {...field} />
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
                        <FormLabel>Enlace al recurso *</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-2">
                    <Label>Archivo *</Label>
                    <Input
                      type="file"
                      accept={watchedType === 'video' ? 'video/*' : watchedType === 'infografia' ? 'image/*' : '.pdf,.doc,.docx'}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
                      <FormLabel>Descripción *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe el contenido del recurso..."
                          className="min-h-[100px]"
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
                      <FormLabel>Fuentes (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Referencias, enlaces o fuentes del contenido..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirmations */}
                <div className="space-y-4 border border-border rounded-lg p-6 bg-muted/30">
                  <h3 className="font-semibold text-foreground">Confirmaciones requeridas</h3>
                  
                  <FormField
                    control={form.control}
                    name="acceptedLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
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
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
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
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            Confirmo que este recurso <strong>no contiene datos sensibles</strong> ni información personal
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
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
