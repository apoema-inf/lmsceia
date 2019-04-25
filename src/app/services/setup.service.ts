import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class SetupService {

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private af: AngularFirestore) { }

  getCursosInfo() {
    return new Promise((resolve, reject) => {
      let result = [];
      this.af.collection("meta-info").ref.get().then(cursos => {
        cursos.forEach(curso => {
          result.push(curso.data());
        });
        resolve(result);
      });
    });
  }

}
