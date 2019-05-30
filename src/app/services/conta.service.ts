import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Conta } from 'app/models/conta.model';
import { Time } from '@angular/common';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable()
export class ContaService {

  constructor(private angularFirestore: AngularFirestore) { }

  getTimeSaldo(timeId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('/times').doc(timeId).get().toPromise().then((time) => {
        resolve(time.data().saldo);
      });
    });
  }

}
