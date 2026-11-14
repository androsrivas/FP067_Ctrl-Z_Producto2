import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Player } from '../models/player.model';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private firestore: Firestore = inject(Firestore);

  getPlayers(): Observable<Player[]> {

    const playersCollection =
      collection(this.firestore, 'players');

    return collectionData(
      playersCollection,
      { idField: 'firebaseId' }
    ) as Observable<Player[]>;
  }
  async deletePlayer(firebaseId: string): Promise<void> {
  const playerDoc = doc(
    this.firestore,
    `players/${firebaseId}`
  );

  await deleteDoc(playerDoc);
  }
}