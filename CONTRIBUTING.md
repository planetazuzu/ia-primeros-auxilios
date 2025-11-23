# Guía de Contribución

¡Gracias por tu interés en contribuir a este repositorio de recursos educativos sobre primeros auxilios!

## 📝 Cómo preparar tus aportes

Para mantener la calidad y utilidad del repositorio, te pedimos que sigas estas pautas al subir nuevos recursos.

### 1. Metadatos

Acompaña cada recurso con un archivo metadata `.md` con el mismo nombre base.
**Ejemplo:** `protocolos/rcp_adulto_v1.md` → `protocolos/rcp_adulto_v1_metadata.md`

#### Campos mínimos requeridos en el archivo de metadata:

```markdown
---
Título: [Título descriptivo del recurso]
Autor: [Nombre del Autor / Organización]
Fecha: [YYYY-MM-DD]
Licencia: [Tipo de licencia, ej: CC BY-SA 4.0]
Fuente: [Enlace o referencia a la fuente original]
Idioma: [Español / Inglés / etc.]
Accesibilidad:
  [Detalles sobre accesibilidad: transcripción, subtítulos, alt text, etc.]
---

[Descripción adicional o notas sobre uso y restricciones]
```

### 2. Nomenclatura

- Usa nombres descriptivos y normalizados.
- Usa `snake_case` para los nombres de archivo (ej: `guia_rcp_basica.pdf`).
- Evita caracteres especiales o espacios en los nombres de archivo.

### 3. Derechos de Autor

- **Sube solo materiales propios o con permiso expreso del autor.**
- Si usas extractos (imágenes, textos, tablas), indica las fuentes y permisos en el archivo metadata.
- No subas documentos con datos personales sensibles sin consentimiento y anonimización.
- Prioriza materiales con licencias CC BY, CC BY-SA, o equivalentes.

## 🚀 Proceso de Contribución

1.  **Fork** este repositorio.
2.  Crea una nueva rama (`git checkout -b nuevo-recurso-rcp`).
3.  Añade tu recurso en la carpeta correspondiente (`protocolos`, `guias`, etc.).
4.  Añade el archivo de metadata correspondiente.
5.  Haz commit de tus cambios (`git commit -m "Añadir protocolo de RCP adulto"`).
6.  Haz push a tu rama (`git push origin nuevo-recurso-rcp`).
7.  Abre un **Pull Request** describiendo tu aporte.

¡Esperamos tus contribuciones para hacer de este un recurso valioso para todos!
