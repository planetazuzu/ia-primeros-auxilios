/**
 * Parser de metadata de archivos Markdown
 * Extrae frontmatter y contenido de archivos .md
 */

export interface ParsedMetadata {
  titulo: string;
  tipo?: string;
  fecha?: string;
  descripcion?: string;
  enlace?: string;
  archivo?: string;
  tags?: string[];
  autor?: string;
  licencia?: string;
  idioma?: string;
  fuentes?: string;
  [key: string]: any; // Para campos adicionales
}

/**
 * Parsea el contenido de un archivo markdown y extrae el frontmatter
 */
export function parseMarkdownMetadata(content: string): ParsedMetadata {
  const metadata: ParsedMetadata = {
    titulo: '',
  };

  // Buscar frontmatter (entre ---)
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    const frontmatter = match[1];
    const body = match[2];

    // Parsear campos del frontmatter
    const lines = frontmatter.split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remover comillas si existen
        value = value.replace(/^["']|["']$/g, '');
        
        // Procesar tags (array)
        if (key.toLowerCase() === 'tags' && value.startsWith('[')) {
          try {
            metadata.tags = JSON.parse(value);
          } catch {
            // Si falla, intentar parsear manualmente
            metadata.tags = value
              .replace(/[\[\]]/g, '')
              .split(',')
              .map(t => t.trim().replace(/["']/g, ''))
              .filter(t => t.length > 0);
          }
        } else {
          metadata[key.toLowerCase()] = value;
        }
      }
    }

    // Si no hay título en frontmatter, intentar extraer del body
    if (!metadata.titulo && body) {
      const titleMatch = body.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        metadata.titulo = titleMatch[1].trim();
      }
    }

    // Extraer descripción del body si no existe
    if (!metadata.descripcion && body) {
      const paragraphs = body.split('\n\n').filter(p => p.trim().length > 0);
      if (paragraphs.length > 0) {
        // Tomar el primer párrafo que no sea el título
        const firstParagraph = paragraphs.find(p => !p.startsWith('#'));
        if (firstParagraph) {
          metadata.descripcion = firstParagraph.substring(0, 200).trim();
        }
      }
    }
  } else {
    // Si no hay frontmatter, intentar extraer título del contenido
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.titulo = titleMatch[1].trim();
    } else {
      // Usar primera línea como título
      const firstLine = content.split('\n')[0].trim();
      metadata.titulo = firstLine || 'Sin título';
    }
  }

  return metadata;
}

/**
 * Obtiene metadata desde un archivo .md en GitHub
 */
export async function fetchMarkdownMetadata(
  downloadUrl: string
): Promise<ParsedMetadata | null> {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      return null;
    }
    const content = await response.text();
    return parseMarkdownMetadata(content);
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return null;
  }
}

