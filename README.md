# Repositorio colaborativo de recursos educativos reutilizables sobre primeros auxilios y emergencias sanitarias

Este espacio reúne protocolos, manuales, infografías, vídeos y textos orientados a la formación, divulgación y entrenamiento de herramientas educativas basadas en IA en el ámbito de los primeros auxilios.

## 🎯 Propósito y enfoque

### Propósito

Centralizar recursos abiertos, de calidad y bien documentados que puedan ser utilizados por educadores, profesionales de la salud y herramientas educativas (incluyendo IA) para mejorar la respuesta en situaciones de emergencia.

### Tipo de materiales

Protocolos de actuación, fichas rápidas, guías completas (PDF/presentaciones), infografías, enlaces a vídeos demostrativos y artículos didácticos.

### Enfoque

Educativo, accesible, basado en evidencia y respetuoso con la autoría.

## 🧭 Objetivos del proyecto

- **Educación**: facilitar materiales claros y prácticos para la formación en primeros auxilios.
- **Accesibilidad**: promover formatos accesibles (textos claros, imágenes con descripciones, subtítulos en vídeos).
- **Colaboración abierta**: fomentar una comunidad global que aporte, revise y actualice recursos de forma continua.

## 📂 Estructura de carpetas

- `protocolos/` → Fichas rápidas y protocolos de actuación
- `guias/` → Manuales y presentaciones didácticas
- `infografias/` → Imágenes e infografías educativas
- `videos/` → Enlaces o descripciones de vídeos demostrativos
- `textos/` → Artículos, listados, casos clínicos, etc.
- `enlaces/` → Enlaces a recursos externos
- `README.md` → Este archivo
- `CONTRIBUTING.md` → Guía detallada para colaborar
- `LICENSE` → Licencia Creative Commons BY-SA 4.0

## 🧩 Ejemplos de contenido esperado

- **Protocolos**: fichas rápidas (RCP, hemorragias, obstrucción de vía aérea, shock, quemaduras).
- **Guías**: manuales o presentaciones listos para usar en formación.
- **Infografías**: con descripción alternativa (alt text) y versiones en alta resolución.
- **Vídeos**: enlaces con timestamps y transcripciones o subtítulos cuando sea posible.
- **Textos**: artículos, listas de materiales, checklists y casos clínicos.

## ⚖️ Licencia

Este proyecto está bajo la Licencia **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

Puedes compartir y adaptar los materiales para cualquier propósito, incluso comercial, siempre que:

1.  Atribuyas al autor original.
2.  Licencies tus modificaciones bajo los mismos términos.
3.  Respetes los derechos de autor de terceros.

---

## 🛠️ Configuración Técnica (Para Desarrolladores)

Este repositorio también contiene una aplicación web para facilitar la contribución y visualización de recursos.

### Requisitos

- Node.js & npm

### Instalación y Ejecución

```sh
# Instalar dependencias
npm install

# Configurar variables de entorno (ver env.example)
cp env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración .env

```env
VITE_GITHUB_TOKEN=tu_token_aqui
VITE_GITHUB_OWNER=planetazuzu
VITE_GITHUB_REPO=ia-primeros-auxilios
```
