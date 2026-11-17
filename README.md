# FP067 - Ctrl-Z | Producto 2: EQUIPO BASKET

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

Este repositorio contiene la entrega del **Producto 2** del equipo **Ctrl-Z** para la asignatura **FP067**. Partiendo de la _Single Page Application_ desarrollada en el Producto 1 con **Angular** y **Bootstrap**, en esta entrega se integra **Firebase** como base de datos en la nube para hacer persistente la información del **EQUIPO BASKET**.

---

## Descripción del Proyecto

El objetivo de este producto es convertir la aplicación en una aplicación real conectada a una base de datos **NoSQL** en la nube (**Cloud Firestore**). Los datos que en el Producto 1 se cargaban desde el array local `PLAYERS_DATA` pasan a almacenarse en una colección de Firestore, a la que la aplicación se suscribe en tiempo real. Además, se añaden operaciones de **alta, edición y borrado** de jugadores desde la propia interfaz.

### Características Principales

- **Base de datos en Firestore:** Colección `players` con **10 jugadores** y todos los campos definidos en el Producto 1 (nombre, apellidos, dorsal, edad, altura, nacionalidad, estadísticas, posición, foto y vídeo).
- **Suscripción en tiempo real:** El listado y el detalle se actualizan automáticamente, sin refrescar la página, al añadir, editar o eliminar un jugador (también si el cambio se hace directamente desde la consola de Firebase).
- **Listado de Jugadores (`PlayersComponent`):** Icono de **borrar** en cada tarjeta (con confirmación) y botón **Nuevo** en la cabecera para añadir un jugador mediante un formulario.
- **Detalle del Jugador (`DetailComponent`):** Botón **Editar** que permite modificar y guardar todos los campos del jugador, y botón para eliminarlo.
- **Formulario reutilizable (`PlayerFormComponent`):** Formlario reactivo de alta construido con los átomos `app-input` y `app-button`.
- **Subida de multimedia:** Selección de imagen y vídeo desde el ordenador, almacenados en **Firebase Storage** y referenciados en Firestore mediante su URL de descarga.
- **Validación de formularios:** Campos obligatorios con mensajes de error, validación del tipo y tamaño de los archivos, y mensaje de confirmación al guardar.
- **Reproductor Multimedia (`MediaComponent`)** y **Filtros (Pipes)** del Producto 1, ahora alimentados con los datos de Firestore.

---

## Estructura de Componentes y Arquitectura

La aplicación mantiene el diseño atómico del Producto 1 y añade una capa de servicio para el acceso a Firebase, inyectada en los componentes mediante el sistema de inyección de dependencias de Angular (`@Injectable({ providedIn: 'root' })`):

```text
FP067_CtrlZ_Producto2/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── atoms/               # UI básica e indivisible
│   │   │   │   ├── badge/
│   │   │   │   ├── button/          # Variantes accent, primary, outline, icon, icon-danger
│   │   │   │   ├── input/           # Compatible con formularios reactivos (ControlValueAccessor)
│   │   │   │   ├── logo/
│   │   │   │   ├── nav-link/
│   │   │   │   └── stat-card/
│   │   │   ├── molecules/           # Grupos de átomos que forman unidades funcionales
│   │   │   │   ├── filter-bar/
│   │   │   │   ├── media-controls/
│   │   │   │   ├── navbar/
│   │   │   │   └── player-card/     # Tarjeta del jugador + botón borrar
│   │   │   ├── organisms/           # Secciones complejas de la interfaz
│   │   │   │   ├── footer/
│   │   │   │   ├── header/
│   │   │   │   ├── player-detail/   # Detalle + edición + borrado del jugador
│   │   │   │   ├── player-form/     # Formulario reutilizable de jugador (alta)
│   │   │   │   ├── player-media/
│   │   │   │   └── players-list/    # Listado filtrado y ordenado
│   │   │   └── templates/           # Estructura del maquetado general
│   │   │       └── team-layout/
│   │   ├── data/                    # PLAYERS_DATA: datos iniciales usados para poblar Firestore
│   │   ├── models/                  # Interfaz Player
│   │   ├── pages/                   # Vistas principales de la aplicación
│   │   │   └── team/                # Página de plantilla: botón Nuevo, alta y borrado
│   │   ├── pipes/                   # Pipes de filtrado y ordenación
│   │   └── services/                # PlayerService (Firestore + Storage)
│   │
│   ├── environments/                # Configuración de Firebase
│   └── assets/                      # Recursos multimedia locales del Producto 1
│       ├── players/
│       └── videos/
│
├── .gitignore                       # Exclusión de node_modules/ y temporales
├── package.json                     # Dependencias del proyecto
└── README.md                        # Documentación oficial
```

---

## Firebase

| Servicio             | Uso                                                                 |
| -------------------- | ------------------------------------------------------------------- |
| **Cloud Firestore**  | Colección `players` con los datos de los jugadores                  |
| **Firebase Storage** | Almacenamiento de las imágenes y vídeos subidos desde el formulario |
| **@angular/fire**    | Librería oficial para conectar Angular con Firebase                 |

### Modelo de datos (`players`)

```ts
export interface Player {
  firebaseId?: string; // ID del documento en Firestore (lo añade collectionData, no se guarda en el documento)
  id: number; // Identificador numérico del jugador
  nombre: string;
  apellidos: string;
  dorsal: number;
  posicion: string; // Base | Escolta | Alero | Ala-pívot | Pívot
  edad: number;
  altura: number; // En metros
  nacionalidad: string;
  puntos: number; // Promedios por partido
  asistencias: number;
  rebotes: number;
  biografia: string;
  foto: string; // URL de Firebase Storage (o ruta de assets/ en los datos del Producto 1)
  videoUrl: string; // URL de Firebase Storage (o ruta de assets/ en los datos del Producto 1)
}
```
### Operaciones del servicio (`PlayerService`)

| Método | Operación |
|---|---|
| `getPlayers()` | Suscripción en tiempo real a la colección (`collectionData`) |
| `addPlayer(player)` | Alta de un jugador (`addDoc`) |
| `updatePlayer(firebaseId, data)` | Edición de un jugador (`updateDoc`) |
| `deletePlayer(firebaseId)` | Borrado de un jugador (`deleteDoc`) |
| `uploadFile(file, folder)` | Subida de imagen o vídeo a Storage y obtención de su URL de descarga |
| `seedPlayers(players)` | Carga inicial de `PLAYERS_DATA` (`writeBatch`), omitiendo los `id` que ya existen |

### Estructura de Storage

```text
players/
├── images/   # image/*, menos de 5 MB
└── videos/   # video/*, menos de 50 MB
```

Los archivos se guardan como `{timestamp}_{nombre-original}` para evitar colisiones. Los límites de tipo y tamaño se validan en el formulario y en las reglas de seguridad de Storage.

### Carga inicial de datos

La colección `players` se pobló a partir del array `PLAYERS_DATA` (`src/app/data/players.mock.ts`) con el método `seedPlayers()` del servicio, que añade en una única operación atómica (`writeBatch`) los jugadores cuyo `id` todavía no existe en Firestore. Se ejecutó una sola vez; después, los datos se gestionan desde la aplicación o desde la consola de Firebase.

---

## Requisitos del Entorno

Para ejecutar este proyecto en local es necesario contar con:

- Node.js: v18.x o superior
- npm: v9.x o superior
- Angular CLI: v17.x
- Git: Para el control de versiones
- Una cuenta de Firebase con acceso al proyecto del equipo
- IDE recomendado: Visual Studio Code

## Instalación y ejecución local

1. Clonar el repositorio:

```bash
git clone https://github.com/androsrivas/FP067_Ctrl-Z_Producto2.git
cd FP067_Ctrl-Z_Producto2
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar Firebase en `src/environments/environment.ts` con las credenciales del proyecto (Consola de Firebase → Configuración del proyecto → Tus apps):

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "XXXX",
    authDomain: "XXXX.firebaseapp.com",
    projectId: "XXXX",
    storageBucket: "XXXX.appspot.com",
    messagingSenderId: "XXXX",
    appId: "XXXX",
  },
};
```

4. Ejecutar el servidor de desarrollo:

```bash
ng serve --open
```

> La aplicación se abrirá automáticamente en `http://localhost:4200`.

### Tecnologías usadas

- Frontend Framework: Angular 17
- Base de datos: Firebase Cloud Firestore
- Almacenamiento de archivos: Firebase Storage
- Conexión con Firebase: @angular/fire
- Estilos y UI Framework: Bootstrap / HTML5 / CSS3
- Lenguaje: TypeScript
- Programación reactiva: RxJS
- Entorno de despliegue en la nube: CodeSandbox
- Gestión de tareas: Trello

---

## Enlaces

- **CodeSandbox:** _pendiente_
- **Trello:** _pendiente_

---

## Equipo de desarrollo: Ctrl + Z

| Integrante | Rol (Producto 2) | GitHub               |
| ---------- | ---------------- | -------------------- |
| Andrea     | _por definir_    | @androsrivas         |
| Iván       | _por definir_    | @uoc-icolmenarblanco |
| Meritxell  | _por definir_    | @mmorenomoya         |
| Marcelo    | _por definir_    | @mpradod             |
| Roche      | _por definir_    | @roche-tan           |
