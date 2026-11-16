export interface Player {
    id: number;
    firebaseId?: string;
    nombre: string;
    apellidos: string;
    dorsal: number;
    posicion: string;
    edad: number;
    altura: number; //en metros (ex: 1.88)
    nacionalidad: string;
    puntos: number;
    asistencias: number;
    rebotes: number;
    biografia: string;
    foto: string;
    videoUrl: string;
}
