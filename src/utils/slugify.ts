/**
 * Normaliza texto a slug seguro para URLs y nombres de archivo
 * Maneja acentos, caracteres especiales y espacios
 */
export function slugify(text: string): string {
  // Mapa de caracteres acentuados a sus equivalentes sin acento
  const accentsMap: Record<string, string> = {
    'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ã': 'a', 'å': 'a',
    'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
    'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
    'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'õ': 'o',
    'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
    'ñ': 'n', 'ç': 'c',
    'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ã': 'A', 'Å': 'A',
    'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
    'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Õ': 'O',
    'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
    'Ñ': 'N', 'Ç': 'C',
  };

  return text
    .toString()
    .split('')
    .map(char => accentsMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '')      // Remover caracteres no alfanuméricos (excepto guiones)
    .replace(/\-\-+/g, '-')        // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, '')            // Remover guiones al inicio
    .replace(/-+$/, '');           // Remover guiones al final
}
