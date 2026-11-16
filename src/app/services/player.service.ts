import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Player } from '../models/player.model';

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

  updatePlayer(firebaseId: string, data: Partial<Player>): Promise<void> {
    const { firebaseId: _, ...fields } = data;
    const playerRef = doc(this.firestore, 'players', firebaseId);
    return updateDoc(playerRef, fields);
  }
}