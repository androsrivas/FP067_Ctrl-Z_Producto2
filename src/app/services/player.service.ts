import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
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