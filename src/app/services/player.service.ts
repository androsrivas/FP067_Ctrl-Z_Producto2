import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData
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
}