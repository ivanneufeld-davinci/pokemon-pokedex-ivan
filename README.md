# Pokédex — Vue 3

## Descripción

Aplicación web interactiva que permite explorar Pokémon, consultar sus características y guardar favoritos. Desarrollada con Vue 3 y Vite, utilizando la API pública PokéAPI.

## Tecnologías utilizadas

- Vue 3
- Vite
- Vue Router
- JavaScript
- HTML5 y CSS3
- PokéAPI
- localStorage para persistir los favoritos

## Funcionalidades

- Listado de Pokémon obtenidos desde PokéAPI.
- Búsqueda por nombre.
- Filtro por tipo.
- Paginación de 12 Pokémon por página.
- Página de detalle con imagen, tipos, habilidades y estadísticas.
- Agregar y quitar Pokémon de favoritos.
- Persistencia de favoritos mediante localStorage.
- Parámetros de URL para conservar la búsqueda y el filtro.
- Transiciones entre páginas y animaciones en la lista de favoritos.
- Página 404 para rutas inexistentes.
- Diseño responsive para dispositivos móviles.

## API utilizada

**PokéAPI:** https://pokeapi.co/

La aplicación utiliza los endpoints de Pokémon para obtener el listado y los detalles de cada Pokémon.

## Instalación y ejecución

### Requisitos previos

- Node.js
- npm

### Pasos

1. Clonar o descargar el repositorio.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la URL local que muestra la terminal.

## Capturas de pantalla

Escritorio:
https://imgur.com/a/desktop-view-1-7rmiHAU
https://imgur.com/a/desktop-view-2-TKzAshi
https://imgur.com/a/desktop-view-3-yUJAz2W

Móvil:
https://imgur.com/a/mobile-view-1-vaSiYJ7
https://imgur.com/a/mobile-view-2-wefdqbh
https://imgur.com/a/mobile-view-3-iThTKv5

## Publicación
Se usó Firebase Hosting para publicar la página.
- https://pokemon-pokedex-ivan1.web.app/

## Autoría

- **Alumno/a:** Iván Neufeld
- **Materia:** Aplicaciones para dispositivos móviles
- **Trabajo práctico:** Pokédex con Vue 3.
