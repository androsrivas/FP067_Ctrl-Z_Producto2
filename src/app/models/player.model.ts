export interface Player {
    firebaseId?: string;

    id: number;
    nombre: string;
    apellidos: string;
    dorsal: number;
    posicion: string;
    edad: number;
    altura: number;
    nacionalidad: string;
    puntos: number;
    asistencias: number;
    rebotes: number;
    biografia: string;
    foto: string;
    videoUrl: string;
}