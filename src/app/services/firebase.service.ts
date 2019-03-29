import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class FirebaseService {

  constructor(private af: AngularFirestore) { }

  getTimes() {
    return new Promise((resolve, reject) => {
      let array = [];
      this.af.collection("times").get().toPromise().then(times => {
        times.docs.forEach((time, index) => {
          if(time.id != "Supervisão" && time.id != "Dev"){
            array.push(time);
          }
        });
      }).then(() => {
        resolve(array);
      })
    })
  }

}
