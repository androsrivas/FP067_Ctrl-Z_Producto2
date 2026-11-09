# FP067 - Ctrl-Z | Producto 1: EQUIPO BASKET

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

Este repositorio contiene la entrega del **Producto 1** del equipo **Ctrl-Z** para la asignatura **FP067**. Consiste en una aplicación Web de Página Única (*Single Page Application* - SPA) desarrollada con **Angular** y estilizada con **Bootstrap**, diseñada para la gestión y visualización de un equipo de baloncesto (**EQUIPO BASKET**).

---

## Descripción del Proyecto

El objetivo principal de esta aplicación es ofrecer una interfaz centralizada, atractiva y funcional donde gestionar la plantilla de un equipo de baloncesto. La aplicación permite explorar un listado de jugadores, filtrar la plantilla mediante parámetros específicos, visualizar la ficha detallada de cada deportista y reproducir contenido multimedia personalizado de sus mejores jugadas.

### Características Principales
- **Encabezado (Header):** Identificador y branding oficial del **EQUIPO BASKET**.
- **Listado de Jugadores (`PlayersComponent`):** Visualización interactiva de la plantilla con soporte de selección visual del ítem activo.
- **Detalle del Jugador (`DetailComponent`):** Ficha técnica detallada que muestra información completa (nombre, apellidos, posición, edad, altura, etc.) con opción de cierre para restablecer la selección.
- **Reproductor Multimedia (`MediaComponent`):** Componente dedicado a la previsualización de vídeo de jugadas destacadas con controles personalizados (play, pause, stop, barra de progreso y control de volumen).
- **Filtros Avanzados (Pipes):** Búsqueda dinámica basada en 3 parámetros (nombre, posición y edad) mediante un campo de texto y un menú desplegable (*dropdown*).

---

## Estructura de Componentes y Arquitectura

La aplicación se compone de 3 componentes principales interconectados mediante eventos y bindings de Angular (`@Input` / `@Output`), además de utilizar *pipes* personalizados y un archivo independiente para la carga de datos locales:

```text
FP067_Ctrl-Z_Producto1/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── atoms/               # UI básica e indivisible
│   │   │   │   ├── badge/
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── logo/
│   │   │   │   ├── nav-link/
│   │   │   │   └── stat-card/
│   │   │   ├── molecules/           # Grupos de átomos que forman unidades funcionales
│   │   │   │   ├── filter-bar/
│   │   │   │   ├── media-controls/
│   │   │   │   ├── navbar/
│   │   │   │   └── player-card/
│   │   │   ├── organisms/           # Secciones complejas de la interfaz
│   │   │   │   ├── footer/
│   │   │   │   ├── header/
│   │   │   │   ├── player-detail/
│   │   │   │   ├── player-media/
│   │   │   │   └── players-list/
│   │   │   └── templates/           # Estructura del maquetado general
│   │   │       └── team-layout/
│   │   ├── data/                    # Datos locales de prueba
│   │   ├── models/                  # Interfaz Player
│   │   ├── pages/                   # Vistas principales de la aplicación
│   │   │   └── team/
│   │   └── pipes/                   # Pipes de filtrado y búsqueda personalizada
│   │
│   └── assets/                      # Recurso multimedia local
│       ├── players/                 # Imágenes de los jugadores
│       └── videos/                  # Vídeos de las jugadas destacadas
│
├── .gitignore                       # Exclusión de node_modules/ y temporales
├── package.json                     # Dependencias del proyecto
└── README.md                        # Documentación oficial

```
---

## Requisitos del Entorno

Para ejecutar este proyecto en local es necesario contar con:

- Node.js: v16.x o superior
- npm: v8.x o superior
- Angular CLI: v14.x o superior
- Git: Para el control de versiones
- IDE recomendado: Visual Studio Code, Sublime Text o Atom

## Instalación y ejecución local

1. Clonar el repositorio:
```bash
git clone https://github.com/androsrivas/FP067_Ctrl-Z_Producto1.git
cd FP067_Ctrl-Z_Producto1
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor de desarrollo:
```bash
ng serve --open
```
> La aplicación se abrirá automáticamente en `http://localhost:4200`.

### Tecnologías usadas

- Frontend Framework: Angular 17
- Estilos y UI Framework: Bootstrap / HTML5 / CSS3
- Lenguaje: TypeScript
- Entorno de despliegue en la nube: CodeSandbox
- Gestión de tareas: Trello

---

## Equipo de desarrollo: Ctrl + Z

| Integrante | Rol                                                  | GitHub               |
|------------|------------------------------------------------------|----------------------|
| Andrea     | DevOps + Listado + Pipe + GitHub                     | @androsrivas         |
| Iván       | Detalle + Comunicación                               | @uoc-icolmenarblanco |
| Meritxell  | Reproductor + entrega                                | @mmorenomoya         |
| Marcelo    | Datos/assets + buscador + CodeSandbox + doc. técnica | @mpradod             |
| Roche      | UX/UI + diseño visual + doc. diseño                  | @roche-tan           |
