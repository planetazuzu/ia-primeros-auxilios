import { useState, useCallback } from 'react';
import { 
  githubCreateBranch, 
  githubUploadFile, 
  githubCreatePullRequest 
} from '@/utils/github';
import { ResourcePreview, ResourceFormData } from '@/types/resource';
import { slugify } from '@/utils/slugify';
import { toast } from 'sonner';

export type UploadStep = 'idle' | 'branch' | 'file' | 'metadata' | 'pr' | 'success' | 'error';

export interface UploadState {
  step: UploadStep;
  progress: number;
  error?: string;
  prUrl?: string;
  prNumber?: number;
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

      // Generar nombre de rama
      const timestamp = Date.now();
      const branchName = `add-resource-${slugify(preview.titulo)}-${timestamp}`;
      
      console.log('🚀 Iniciando flujo de subida a GitHub');
      console.log(`📝 Recurso: ${preview.titulo}`);
      console.log(`🌿 Rama: ${branchName}`);

      // Paso 1: Crear rama
      updateState({ step: 'branch', progress: 10 });
      console.log('📌 Paso 1/4: Creando rama...');
      
      const branchResult = await retryOperation(
        () => githubCreateBranch(branchName),
        'crear rama'
      );

      if (!branchResult.success) {
        throw new Error(branchResult.error || 'Error al crear la rama');
      }
      
      updateState({ progress: 30 });
      toast.success('Rama creada exitosamente');

      // Paso 2: Subir archivo (si existe)
      if (formData.file || formData.enlace) {
        updateState({ step: 'file', progress: 40 });
        console.log('📌 Paso 2/4: Subiendo archivo...');
        
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
            branch: branchName,
            filePath,
            content: fileContent,
            message: `Add resource: ${preview.titulo}`,
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

      // Paso 3: Subir metadata
      updateState({ step: 'metadata', progress: 70 });
      console.log('📌 Paso 3/4: Subiendo metadata...');
      
      const metadataPath = `${preview.suggestedFolder}/${preview.suggestedFileName}.md`;
      
      const metadataResult = await retryOperation(
        () => githubUploadFile({
          branch: branchName,
          filePath: metadataPath,
          content: preview.metadata,
          message: `Add metadata for: ${preview.titulo}`,
        }),
        'subir metadata'
      );

      if (!metadataResult.success) {
        throw new Error(metadataResult.error || 'Error al subir la metadata');
      }
      
      updateState({ progress: 85 });
      toast.success('Metadata subida exitosamente');

      // Paso 4: Crear Pull Request
      updateState({ step: 'pr', progress: 90 });
      console.log('📌 Paso 4/4: Creando Pull Request...');
      
      const prTitle = `Nuevo recurso: ${preview.titulo}`;
      const prBody = `## Nuevo recurso educativo

**Tipo:** ${preview.tipo}
**Título:** ${preview.titulo}
**Carpeta:** \`${preview.suggestedFolder}\`

### Descripción
${formData.descripcion}

${formData.autor ? `**Autor/a:** ${formData.autor}\n` : ''}
${formData.fuentes ? `**Fuentes:** ${formData.fuentes}\n` : ''}

---

Este PR fue creado automáticamente desde la aplicación de contribución de recursos.
`;

      const prResult = await retryOperation(
        () => githubCreatePullRequest({
          title: prTitle,
          body: prBody,
          head: branchName,
          base: 'main',
        }),
        'crear Pull Request'
      );

      if (!prResult.success) {
        throw new Error(prResult.error || 'Error al crear el Pull Request');
      }
      
      updateState({ 
        step: 'success', 
        progress: 100,
        prUrl: prResult.prUrl,
        prNumber: prResult.prNumber,
      });
      
      console.log('✅ Flujo completado exitosamente');
      toast.success('Pull Request creado exitosamente');

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

