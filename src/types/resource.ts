export type ResourceType = 'protocolo' | 'guia' | 'infografia' | 'video' | 'texto' | 'enlace';

export interface ResourceFormData {
  titulo: string;
  tipo: ResourceType;
  idioma: string;
  autor?: string;
  descripcion: string;
  fuentes?: string;
  file?: File;
  enlace?: string;
  acceptedLicense: boolean;
  acceptedEducational: boolean;
  acceptedNoSensitiveData: boolean;
}

export interface ResourcePreview {
  titulo: string;
  tipo: ResourceType;
  metadata: string;
  suggestedFolder: string;
  suggestedFileName: string;
  zipBlob?: Blob;
}
