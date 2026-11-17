import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  getDocs,
  writeBatch,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';

import { Observable } from 'rxjs';

import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  getPlayers(): Observable<Player[]> {
    const playersCollection = collection(this.firestore, 'players');
    return collectionData(
      playersCollection,
      { idField: 'firebaseId' }
    ) as Observable<Player[]>;
  }

  async addPlayer(player: Player): Promise<string> {
    const { firebaseId: _, ...fields } = player;
    const docRef = await addDoc(collection(this.firestore, 'players'), fields);
    return docRef.id;
  }

  /** Carga inicial: añade a Firestore los jugadores cuyo id aún no existe. */
  async seedPlayer(players: Player[]): Promise<number> {
    const playersCollection = collection(this.firestore, 'players');
    const snapshot = await getDocs(playersCollection);
    const existingIds = new Set(snapshot.docs.map(d => d.data()['id'] as number));

    const missing = players.filter(p => !existingIds.has(p.id));
    if (missing.length === 0) return 0;

    const batch = writeBatch(this.firestore);
    for (const player of missing) {
      const { firebaseId: _, ...fields } = player;
      batch.set(doc(playersCollection), fields);
    }
    await batch.commit();
    return missing.length;
  }

  updatePlayer(firebaseId: string, data: Partial<Player>): Promise<void> {
    const { firebaseId: _, ...fields } = data;
    const playerRef = doc(this.firestore, 'players', firebaseId);
    return updateDoc(playerRef, fields);
  }

  async deletePlayer(firebaseId: string): Promise<void> {
    const playerDoc = doc(this.firestore, `players/${firebaseId}`);
    await deleteDoc(playerDoc);
  };

  async uploadFile(file: File, folder: 'images' | 'videos'): Promise<string> {
    const path = `players/${folder}/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, path);
    await uploadBytes(fileRef, file, { contentType: file.type });
    return getDownloadURL(fileRef);
  }

  
}