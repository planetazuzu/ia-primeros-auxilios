# IA para Primeros Auxilios - Gestor de Recursos Didácticos

## Descripción del Proyecto

Plataforma colaborativa para contribuir con recursos educativos de primeros auxilios. Comparte protocolos, guías e infografías para entrenar una IA de código abierto.

## Cómo editar este código

**Usar tu IDE preferido**

Puedes clonar este repositorio y trabajar localmente.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Axios (para GitHub API)

## Configuración de GitHub API

Para que la aplicación funcione correctamente, necesitas configurar las variables de entorno:

1. **Copia el archivo de ejemplo:**

   ```sh
   cp env.example .env
   ```

2. **Obtén un token de GitHub:**

   - Ve a [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
   - Genera un nuevo token con permisos `repo` (necesario para crear ramas, subir archivos y crear PRs)

3. **Configura las variables en `.env`:**

   ```env
   VITE_GITHUB_TOKEN=tu_token_aqui
   VITE_GITHUB_OWNER=tu_organizacion_o_usuario
   VITE_GITHUB_REPO=nombre-del-repositorio
   ```

4. **Reinicia el servidor de desarrollo** después de configurar las variables.

**Nota:** El archivo `.env` está en `.gitignore` y no se subirá al repositorio por seguridad.

## Cómo desplegar este proyecto

Puedes desplegar este proyecto en cualquier servicio de hosting estático como Vercel, Netlify, GitHub Pages, etc.

Para construir el proyecto para producción:

```sh
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.
