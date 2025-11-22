export interface ResourceMetadata {
  titulo: string;
  autor?: string;
  fecha: string;
  licencia: string;
  idioma: string;
  tipo: string;
  descripcion: string;
  fuentes?: string;
  didactico: string;
}

export function generateMetadata(data: {
  titulo: string;
  autor?: string;
  tipo: string;
  idioma: string;
  descripcion: string;
  fuentes?: string;
}): string {
  const metadata: ResourceMetadata = {
    titulo: data.titulo,
    autor: data.autor || 'Anónimo',
    fecha: new Date().toISOString().split('T')[0],
    licencia: 'CC BY-SA 4.0',
    idioma: data.idioma,
    tipo: data.tipo,
    descripcion: data.descripcion,
    fuentes: data.fuentes || 'No especificadas',
    didactico: 'Sí. Este material será usado para entrenar una IA con fines exclusivamente educativos.',
  };

  return `---
titulo: "${metadata.titulo}"
autor: "${metadata.autor}"
fecha: "${metadata.fecha}"
licencia: "${metadata.licencia}"
idioma: "${metadata.idioma}"
tipo: "${metadata.tipo}"
descripcion: "${metadata.descripcion}"
fuentes: "${metadata.fuentes}"
didactico: "${metadata.didactico}"
---

# ${metadata.titulo}

${metadata.descripcion}

## Información del recurso

- **Autor/a**: ${metadata.autor}
- **Fecha**: ${metadata.fecha}
- **Tipo**: ${metadata.tipo}
- **Idioma**: ${metadata.idioma}
- **Licencia**: ${metadata.licencia}

## Fuentes

${metadata.fuentes}

## Uso didáctico

${metadata.didactico}
`;
}
