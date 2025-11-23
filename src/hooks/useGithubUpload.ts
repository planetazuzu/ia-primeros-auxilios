import { useState, useCallback } from 'react';
import { 
  githubUploadFile
} from '@/utils/github';
import { ResourcePreview, ResourceFormData } from '@/types/resource';
import { toast } from 'sonner';

export type UploadStep = 'idle' | 'file' | 'metadata' | 'success' | 'error';

export interface UploadState {
  step: UploadStep;
  progress: number;
  error?: string;
  commitUrl?: string;
}

export interface UseGithubUploadReturn {
  state: UploadState;
  upload: (preview: ResourcePreview, formData: ResourceFormData) => Promise<void>;
  reset: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

/**
 * Hook para gestionar el flujo completo de subida a GitHub
 * Sube archivos directamente a la rama main sin crear Pull Requests
 * Incluye manejo de errores, retries y estados de progreso
 */
export function useGithubUpload(): UseGithubUploadReturn {
  const [state, setState] = useState<UploadState>({
    step: 'idle',
    progress: 0,
  });

  const reset = useCallback(() => {
    setState({
      step: 'idle',
      progress: 0,
    });
  }, []);

  const updateState = useCallback((updates: Partial<UploadState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Función auxiliar para retry con backoff exponencial
   */
  const retryOperation = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    retries: number = MAX_RETRIES
  ): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        
        // No reintentar en errores de autenticación o validación
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error;
        }
        
        if (attempt < retries) {
          const delay = RETRY_DELAY * attempt;
          console.warn(`⚠️ Intento ${attempt}/${retries} falló para ${operationName}. Reintentando en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error(`Error en ${operationName} después de ${retries} intentos`);
  };

  const upload = useCallback(async (preview: ResourcePreview, formData: ResourceFormData) => {
    try {
      // Validar token
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token) {
        const error = 'Token de GitHub no configurado. Por favor, configura VITE_GITHUB_TOKEN en tu archivo .env';
        updateState({ step: 'error', error });
        toast.error(error);
        return;
      }

      const owner = import.meta.env.VITE_GITHUB_OWNER || 'organization';
      const repo = import.meta.env.VITE_GITHUB_REPO || 'first-aid-resources';
      
      console.log('🚀 Iniciando subida directa a GitHub');
      console.log(`📝 Recurso: ${preview.titulo}`);
      console.log(`📂 Carpeta: ${preview.suggestedFolder} (clasificado como ${preview.tipo})`);
      console.log(`🎯 Subiendo directamente a rama main`);

      // Paso 1: Subir archivo (si existe)
      if (formData.file || formData.enlace) {
        updateState({ step: 'file', progress: 20 });
        console.log('📌 Paso 1/2: Subiendo archivo directamente a main...');
        
        let fileContent: string | File | Blob;
        let fileName = preview.suggestedFileName;
        
        if (formData.file) {
          fileContent = formData.file;
          // Mantener la extensión original del archivo
          const originalExt = formData.file.name.split('.').pop();
          if (originalExt && !fileName.includes('.')) {
            fileName = `${fileName}.${originalExt}`;
          }
        } else if (formData.enlace) {
          // Para enlaces, crear un archivo de texto con la URL
          fileContent = `# Enlace al recurso\n\nURL: ${formData.enlace}\n\nEste recurso está disponible en el siguiente enlace externo.`;
          fileName = `${fileName}.txt`;
        } else {
          fileContent = preview.titulo;
        }

        const filePath = `${preview.suggestedFolder}/${fileName}`;
        
        const fileResult = await retryOperation(
          () => githubUploadFile({
            branch: 'main', // Subir directamente a main
            filePath,
            content: fileContent,
            message: `Añadir recurso: ${preview.titulo}`,
          }),
          'subir archivo'
        );

        if (!fileResult.success) {
          throw new Error(fileResult.error || 'Error al subir el archivo');
        }
        
        updateState({ progress: 60 });
        toast.success('Archivo subido exitosamente');
      } else {
        // Si no hay archivo, saltar este paso
        updateState({ progress: 60 });
      }

      // Paso 2: Subir metadata
      updateState({ step: 'metadata', progress: 70 });
      console.log('📌 Paso 2/2: Subiendo metadata directamente a main...');
      
      const metadataPath = `${preview.suggestedFolder}/${preview.suggestedFileName}.md`;
      
      const metadataResult = await retryOperation(
        () => githubUploadFile({
          branch: 'main', // Subir directamente a main
          filePath: metadataPath,
          content: preview.metadata,
          message: `Añadir metadata: ${preview.titulo}`,
        }),
        'subir metadata'
      );

      if (!metadataResult.success) {
        throw new Error(metadataResult.error || 'Error al subir la metadata');
      }
      
      updateState({ progress: 95 });
      toast.success('Metadata subida exitosamente');

      // Generar URL del commit
      const commitUrl = `https://github.com/${owner}/${repo}/tree/main/${preview.suggestedFolder}`;
      
      updateState({ 
        step: 'success', 
        progress: 100,
        commitUrl,
      });
      
      console.log('✅ Recurso subido exitosamente a main');
      console.log(`🔗 Ver en: ${commitUrl}`);
      toast.success('Recurso subido exitosamente al repositorio');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido durante la subida';
      console.error('❌ Error en el flujo de subida:', errorMessage);
      
      updateState({ 
        step: 'error', 
        error: errorMessage,
      });
      
      toast.error(`Error: ${errorMessage}`);
    }
  }, [updateState]);

  return {
    state,
    upload,
    reset,
  };
}

