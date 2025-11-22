/**
 * Funciones para crear Issues en GitHub
 * NO modifica el flujo de PR existente
 */

import axios from 'axios';

const OWNER = import.meta.env.VITE_GITHUB_OWNER || 'planetazuzu';
const REPO = import.meta.env.VITE_GITHUB_REPO || 'ia-primeros-auxilios';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const api = axios.create({
  baseURL: `https://api.github.com/repos/${OWNER}/${REPO}`,
  headers: {
    'Authorization': TOKEN ? `Bearer ${TOKEN}` : '',
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  },
});

export interface CreateIssueParams {
  title: string;
  body: string;
  labels?: string[];
}

export interface CreateIssueResult {
  success: boolean;
  issueUrl?: string;
  issueNumber?: number;
  error?: string;
}

/**
 * Crea un Issue en GitHub
 */
export async function createGitHubIssue(
  params: CreateIssueParams
): Promise<CreateIssueResult> {
  if (!TOKEN) {
    return {
      success: false,
      error: 'Token de GitHub no configurado',
    };
  }

  try {
    console.log(`📝 Creando Issue: ${params.title}`);
    
    const response = await api.post('/issues', {
      title: params.title,
      body: params.body,
      labels: params.labels || [],
    });

    const issueUrl = response.data.html_url;
    const issueNumber = response.data.number;

    console.log(`✅ Issue creado: ${issueUrl}`);
    return {
      success: true,
      issueUrl,
      issueNumber,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('❌ Error al crear Issue:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Crea un Issue para solicitar modificación de un recurso
 */
export async function requestResourceModification(
  filePath: string,
  description: string,
  email?: string
): Promise<CreateIssueResult> {
  const title = `Solicitud de modificación: ${filePath}`;
  const body = `## Solicitud de Modificación

**Archivo:** \`${filePath}\`

**Descripción del cambio solicitado:**
${description}

${email ? `**Contacto:** ${email}\n` : ''}

---
*Issue creado automáticamente desde la aplicación de contribución.*`;

  return createGitHubIssue({
    title,
    body,
    labels: ['modificación', 'solicitud'],
  });
}

/**
 * Crea un Issue para solicitar eliminación de un recurso
 */
export async function requestResourceDeletion(
  filePath: string,
  justification: string,
  email?: string
): Promise<CreateIssueResult> {
  const title = `Solicitud de eliminación: ${filePath}`;
  const body = `## Solicitud de Eliminación

**Archivo:** \`${filePath}\`

**Justificación:**
${justification}

${email ? `**Contacto:** ${email}\n` : ''}

---
*Issue creado automáticamente desde la aplicación de contribución.*`;

  return createGitHubIssue({
    title,
    body,
    labels: ['eliminación', 'solicitud'],
  });
}

/**
 * Crea un Issue para solicitar reclasificación de un recurso
 */
export async function requestResourceReclassification(
  filePath: string,
  targetFolder: string,
  justification: string,
  email?: string
): Promise<CreateIssueResult> {
  const title = `Reclasificación: ${filePath}`;
  const body = `## Solicitud de Reclasificación

**Archivo:** \`${filePath}\`

**Carpeta destino sugerida:** \`${targetFolder}\`

**Justificación:**
${justification}

${email ? `**Contacto:** ${email}\n` : ''}

---
*Issue creado automáticamente desde la aplicación de contribución.*`;

  return createGitHubIssue({
    title,
    body,
    labels: ['reclasificación', 'solicitud'],
  });
}

