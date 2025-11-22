# 🔐 Guía de Configuración de GitHub API

Esta guía te ayudará a configurar el acceso a GitHub para que la aplicación pueda crear ramas, subir archivos y crear Pull Requests.

## 📋 Requisitos Previos

1. **Cuenta de GitHub** activa
2. **Repositorio** creado en GitHub (o acceso a uno existente)
3. **Permisos** para crear ramas y PRs en el repositorio

## 🚀 Pasos para Configurar

### Paso 1: Crear un Personal Access Token (PAT)

1. **Ve a la configuración de tokens de GitHub:**
   - URL directa: https://github.com/settings/tokens
   - O navega: Tu perfil → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Haz clic en "Generate new token" → "Generate new token (classic)"**

3. **Configura el token:**
   - **Note (nombre)**: `Aid Kit Contributor App` (o el nombre que prefieras)
   - **Expiration**: Elige una fecha de expiración (recomendado: 90 días o más)
   - **Scopes (permisos)**: Marca la casilla **`repo`** (esto incluye todos los permisos de repositorio)
     - ✅ `repo` - Acceso completo a repositorios privados y públicos
     - Esto incluye: crear ramas, subir archivos, crear PRs, leer repositorios

4. **Haz clic en "Generate token"**

5. **⚠️ IMPORTANTE: Copia el token inmediatamente**
   - GitHub solo te mostrará el token UNA VEZ
   - Si lo pierdes, tendrás que crear uno nuevo
   - Guárdalo en un lugar seguro (gestor de contraseñas)

### Paso 2: Identificar tu Repositorio

Necesitas saber:
- **OWNER**: El propietario del repositorio (tu usuario o la organización)
- **REPO**: El nombre del repositorio

**Ejemplo:**
- Si tu repositorio es: `https://github.com/mi-usuario/first-aid-resources`
  - OWNER = `mi-usuario`
  - REPO = `first-aid-resources`

### Paso 3: Configurar Variables de Entorno

1. **Crea el archivo `.env` desde el ejemplo:**
   ```bash
   cp env.example .env
   ```

2. **Edita el archivo `.env`** con tu editor favorito:
   ```bash
   nano .env
   # o
   code .env
   # o
   vim .env
   ```

3. **Reemplaza los valores:**
   ```env
   VITE_GITHUB_TOKEN=ghp_tu_token_aqui_sin_comillas
   VITE_GITHUB_OWNER=tu-usuario-o-organizacion
   VITE_GITHUB_REPO=nombre-del-repositorio
   ```

   **Ejemplo real:**
   ```env
   VITE_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
   VITE_GITHUB_OWNER=planetazuzu
   VITE_GITHUB_REPO=first-aid-resources
   ```

4. **Guarda el archivo**

### Paso 4: Reiniciar el Servidor

Después de crear/editar el archivo `.env`, necesitas reiniciar el servidor de desarrollo:

1. **Detén el servidor actual** (Ctrl+C en la terminal)
2. **Inicia el servidor nuevamente:**
   ```bash
   npm run dev
   ```

### Paso 5: Verificar la Configuración

1. **Abre la aplicación** en el navegador: http://localhost:8080
2. **Abre la consola del navegador** (F12 → Console)
3. **Verifica que NO aparezca** el mensaje:
   ```
   ⚠️ VITE_GITHUB_TOKEN no está configurado
   ```
4. **Prueba listar recursos:**
   - Ve a "Ver repositorio" en la aplicación
   - Debería cargar los archivos del repositorio (o mostrar un error específico de GitHub si hay un problema)

## 🔍 Solución de Problemas

### Error: "Token de GitHub no configurado"
- ✅ Verifica que el archivo `.env` existe en la raíz del proyecto
- ✅ Verifica que el token está correctamente escrito (sin comillas, sin espacios)
- ✅ Reinicia el servidor después de crear/editar `.env`

### Error: "Bad credentials" o 401 Unauthorized
- ✅ Verifica que el token es correcto
- ✅ Verifica que el token no ha expirado
- ✅ Verifica que el token tiene permisos `repo`

### Error: "Not Found" o 404
- ✅ Verifica que OWNER y REPO son correctos
- ✅ Verifica que tienes acceso al repositorio
- ✅ Verifica que el repositorio existe

### Error: "Resource not accessible by integration"
- ✅ El token no tiene permisos suficientes
- ✅ Crea un nuevo token con permisos `repo` completos

## 🔒 Seguridad

- ✅ **NUNCA** subas el archivo `.env` al repositorio (ya está en `.gitignore`)
- ✅ **NUNCA** compartas tu token públicamente
- ✅ Si expones tu token accidentalmente, revócalo inmediatamente en GitHub
- ✅ Usa tokens con fecha de expiración
- ✅ Revoca tokens antiguos que ya no uses

## 📝 Resumen Rápido

```bash
# 1. Crear token en GitHub (https://github.com/settings/tokens)
# 2. Copiar archivo de ejemplo
cp env.example .env

# 3. Editar .env con tus valores
nano .env

# 4. Reiniciar servidor
npm run dev
```

## ✅ Checklist

- [ ] Token de GitHub creado con permisos `repo`
- [ ] Token copiado y guardado de forma segura
- [ ] Archivo `.env` creado desde `env.example`
- [ ] Variables `VITE_GITHUB_TOKEN`, `VITE_GITHUB_OWNER`, `VITE_GITHUB_REPO` configuradas
- [ ] Servidor reiniciado
- [ ] Verificado en consola del navegador (sin advertencias)
- [ ] Probado listar recursos del repositorio

---

¿Necesitas ayuda? Revisa los logs en la consola del navegador (F12) para ver errores específicos.

