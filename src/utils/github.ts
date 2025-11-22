/**
 * GitHub API Integration - REAL IMPLEMENTATION
 * Functions to interact with GitHub API for repository management
 */

import axios, { AxiosInstance } from 'axios';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const OWNER = import.meta.env.VITE_GITHUB_OWNER || 'organization';
const REPO = import.meta.env.VITE_GITHUB_REPO || 'first-aid-resources';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Validar token al cargar el módulo
if (!TOKEN) {
  console.warn('⚠️ VITE_GITHUB_TOKEN no está configurado. Las funciones de GitHub no funcionarán.');
}

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

const api: AxiosInstance = axios.create({
  baseURL: `https://api.github.com/repos/${OWNER}/${REPO}`,
  headers: {
    'Authorization': TOKEN ? `Bearer ${TOKEN}` : '',
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  },
});

// ============================================
// INTERFACES Y TIPOS
// ============================================

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
}

export interface CreateBranchParams {
  branchName: string;
  baseBranch?: string;
}

export interface UploadFileParams {
  branch: string;
  filePath: string;
  content: string | ArrayBuffer | File | Blob;
  message: string;
}

export interface CreatePRParams {
  title: string;
  body: string;
  head: string;
  base?: string;
}

export interface RepositoryFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  downloadUrl?: string;
  sha?: string;
  updatedAt?: string;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Convierte contenido a base64
 */
async function toBase64(content: string | ArrayBuffer | File | Blob): Promise<string> {
  if (typeof content === 'string') {
    // Si ya es string, asumimos que es texto plano y lo codificamos
    return btoa(unescape(encodeURIComponent(content)));
  }
  
  if (content instanceof File || content instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo data:...;base64,
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(content);
    });
  }
  
  // ArrayBuffer
  const bytes = new Uint8Array(content);
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

/**
 * Obtiene el SHA de la rama por defecto (main o master)
 */
async function getDefaultBranchSha(baseBranch: string = 'main'): Promise<string> {
  try {
    const response = await api.get(`/git/refs/heads/${baseBranch}`);
    return response.data.object.sha;
  } catch (error: any) {
    // Si main no existe, intentar con master
    if (baseBranch === 'main') {
      try {
        const response = await api.get('/git/refs/heads/master');
        return response.data.object.sha;
      } catch {
        throw new Error('No se pudo encontrar la rama principal (main/master)');
      }
    }
    throw new Error(`Error al obtener SHA de la rama ${baseBranch}: ${error.response?.data?.message || error.message}`);
  }
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Crea una nueva rama en el repositorio
 */
export async function githubCreateBranch(
  branchName: string,
  baseBranch: string = 'main'
): Promise<{ success: boolean; branchName: string; error?: string }> {
  if (!TOKEN) {
    return {
      success: false,
      branchName,
      error: 'Token de GitHub no configurado. Por favor, configura VITE_GITHUB_TOKEN en tu archivo .env',
    };
  }

  try {
    console.log(`🌿 Creando rama: ${branchName} desde ${baseBranch}`);
    
    // Obtener SHA de la rama base
    const baseSha = await getDefaultBranchSha(baseBranch);
    
    // Crear la nueva rama
    const response = await api.post('/git/refs', {
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    console.log(`✅ Rama creada exitosamente: ${branchName}`);
    return {
      success: true,
      branchName,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('❌ Error al crear rama:', errorMessage);
    
    // Si la rama ya existe, considerarlo como éxito
    if (error.response?.status === 422 && errorMessage.includes('already exists')) {
      console.log(`ℹ️ La rama ${branchName} ya existe, continuando...`);
      return {
        success: true,
        branchName,
      };
    }
    
    return {
      success: false,
      branchName,
      error: errorMessage,
    };
  }
}

/**
 * Sube un archivo al repositorio
 */
export async function githubUploadFile(
  params: UploadFileParams
): Promise<{ success: boolean; filePath: string; error?: string }> {
  if (!TOKEN) {
    return {
      success: false,
      filePath: params.filePath,
      error: 'Token de GitHub no configurado',
    };
  }

  try {
    console.log(`📤 Subiendo archivo: ${params.filePath}`);
    
    // Convertir contenido a base64
    const content = await toBase64(params.content);
    
    // Subir archivo
    const response = await api.put(`/contents/${params.filePath}`, {
      message: params.message,
      content: content,
      branch: params.branch,
    });

    console.log(`✅ Archivo subido exitosamente: ${params.filePath}`);
    return {
      success: true,
      filePath: params.filePath,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('❌ Error al subir archivo:', errorMessage);
    
    return {
      success: false,
      filePath: params.filePath,
      error: errorMessage,
    };
  }
}

/**
 * Crea un Pull Request
 */
export async function githubCreatePullRequest(
  params: CreatePRParams
): Promise<{ success: boolean; prUrl?: string; prNumber?: number; error?: string }> {
  if (!TOKEN) {
    return {
      success: false,
      error: 'Token de GitHub no configurado',
    };
  }

  try {
    console.log(`🔀 Creando Pull Request: ${params.title}`);
    
    const response = await api.post('/pulls', {
      title: params.title,
      body: params.body,
      head: params.head,
      base: params.base || 'main',
    });

    const prUrl = response.data.html_url;
    const prNumber = response.data.number;

    console.log(`✅ Pull Request creado: ${prUrl}`);
    return {
      success: true,
      prUrl,
      prNumber,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('❌ Error al crear Pull Request:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Lista archivos del repositorio
 */
export async function githubListRepositoryFiles(
  path: string = ''
): Promise<{ success: boolean; files?: RepositoryFile[]; error?: string }> {
  if (!TOKEN) {
    return {
      success: false,
      error: 'Token de GitHub no configurado',
    };
  }

  try {
    console.log(`📂 Listando archivos en: ${path || 'raíz'}`);
    
    const url = path ? `/contents/${path}` : '/contents';
    const response = await api.get(url);

    const files: RepositoryFile[] = response.data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      size: item.size,
      downloadUrl: item.download_url,
      sha: item.sha,
      updatedAt: item.updated_at || item.created_at,
    }));

    console.log(`✅ ${files.length} archivos encontrados`);
    return {
      success: true,
      files,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('❌ Error al listar archivos:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Obtiene el SHA de la rama por defecto (función auxiliar exportada)
 */
export async function githubGetDefaultBranchSha(
  baseBranch: string = 'main'
): Promise<{ success: boolean; sha?: string; error?: string }> {
  if (!TOKEN) {
    return {
      success: false,
      error: 'Token de GitHub no configurado',
    };
  }

  try {
    const sha = await getDefaultBranchSha(baseBranch);
    return {
      success: true,
      sha,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Lista todos los recursos del repositorio recursivamente
 * NUEVA FUNCIÓN - No modifica funciones existentes
 */
export async function listAllResources(): Promise<{ success: boolean; files?: RepositoryFile[]; error?: string }> {
  if (!TOKEN) {
    return {
      success: false,
      error: 'Token de GitHub no configurado',
    };
  }

  try {
    console.log('📂 Listando todos los recursos del repositorio...');
    
    const allFiles: RepositoryFile[] = [];
    // Carpetas reales del repositorio: documentos, guias, infografias, protocolos, templates, videos
    const folders = ['protocolos', 'guias', 'infografias', 'videos', 'documentos', 'templates'];
    
    // Listar archivos de cada carpeta
    for (const folder of folders) {
      try {
        const result = await githubListRepositoryFiles(folder);
        if (result.success && result.files) {
          console.log(`📁 Carpeta ${folder}: ${result.files.length} items encontrados`);
          // Filtrar solo archivos (no directorios) y excluir .md
          const files = result.files.filter(
            f => f.type === 'file' && !f.name.endsWith('.md')
          );
          console.log(`   → ${files.length} archivos (excluyendo .md)`);
          if (files.length > 0) {
            files.forEach(f => console.log(`   - ${f.name}`));
          }
          allFiles.push(...files);
        } else {
          console.log(`📁 Carpeta ${folder}: sin archivos o error`);
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
        console.warn(`⚠️ Error al listar carpeta ${folder}:`, errorMsg);
        // Continuar con otras carpetas
      }
    }
    
    console.log(`✅ ${allFiles.length} recursos encontrados en total`);
    return {
      success: true,
      files: allFiles,
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    console.error('❌ Error al listar todos los recursos:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
