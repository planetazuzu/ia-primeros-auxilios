import JSZip from 'jszip';
import { slugify } from './slugify';

export interface ZipContent {
  fileName: string;
  fileContent: File | Blob | string;
  metadataContent: string;
  tipo: string;
}

export async function buildZip(content: ZipContent): Promise<Blob> {
  const zip = new JSZip();
  
  // Determine folder based on type
  const folderMap: Record<string, string> = {
    'protocolo': 'protocolos',
    'guia': 'guias',
    'infografia': 'infografias',
    'video': 'videos',
    'texto': 'textos',
    'enlace': 'enlaces',
  };
  
  const folder = folderMap[content.tipo] || 'otros';
  const slugifiedName = slugify(content.fileName);
  
  // Add file to appropriate folder
  if (content.fileContent instanceof File || content.fileContent instanceof Blob) {
    zip.file(`${folder}/${slugifiedName}`, content.fileContent);
  } else {
    zip.file(`${folder}/${slugifiedName}.txt`, content.fileContent);
  }
  
  // Add metadata file
  zip.file(`${folder}/${slugifiedName}.md`, content.metadataContent);
  
  // Generate ZIP
  return await zip.generateAsync({ type: 'blob' });
}

export function downloadZip(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(fileName)}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
