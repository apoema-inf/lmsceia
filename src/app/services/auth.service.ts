import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from "rxjs/operators";
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Membro } from 'app/models/membro.model';
import { Time } from 'app/models/time.model';

@Injectable()
export class AuthService {

  userObservable: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private af: AngularFirestore
  ) { this.userObservable = afAuth.authState;}

  user: any;

  errorToast(message: string): void {
    this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span>' + message, '', {
      timeOut: 5000,
      enableHtml: true,
      closeButton: false,
      toastClass: "alert alert-danger alert-with-icon",
      positionClass: 'toast-top-center'
    });
  }

  loginEmail(email: string, pass: string) {
    var that = this;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, pass);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => {
          console.log(userData.user.uid);
          this.findUser();
          resolve(userData)
        },
          error => {
            switch (error.code) {
              case 'auth/wrong-password': {
                that.errorToast('Senha incorreta.');
                break;
              }
              case 'auth/user-not-found': {
                that.errorToast('Usuário não encontrado.');
                break;
              }
              default: {
                that.errorToast(error.message);
                break;
              }
            }
            reject(error);
          });
    });
  }

  getAuth() {
    return this.findUser();
  }

  getUsersByTime(time) {
    return new Promise((resolve, reject) => {
      let reference = this.af.collection("times").doc(time.id);
      let members = [];
      this.af.collection("membros").ref.where('idtime', '==', reference.ref).get().then(membros => {
        membros.forEach(element => {
          members.push(element.data());
        });
        resolve(members);
      });
    });
  }

  getUserTimeId() {
    var that = this;
    return new Promise(function (resolve, reject) {

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          var docRef = that.af.collection("membros").doc(user.uid);

          docRef.ref.
            get().then(documentSnapshot => {
              if (documentSnapshot.exists) {
                documentSnapshot.data().idtime.get().then(function (doc) {
                  if (doc.exists) {
                    resolve(doc.id);
                  } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                  }
                }).catch(function (error) {
                  console.log("Error getting document:", error);
                });

              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
        } else {
          // No user is signed in.
          reject('erro');
        }
      });
    })
  }

  findUser() {
    let that = this;
    let localUser = new Membro();
    localUser.time = new Time();
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if(user) {
          let docRef = that.af.collection("membros").doc(user.uid);
          docRef.ref.get().then((docSnapshot) => {
            if(docSnapshot.exists) {
              localUser.email = docSnapshot.data().email;
                localUser.curso = docSnapshot.data().curso;
                localUser.nome = docSnapshot.data().nome;
                localUser.pontuacao = docSnapshot.data().pontuacao;
                docSnapshot.data().idtime.get().then((doc) => {
                  if(doc.exists) {
                    localUser.time.id = doc.id;
                    localUser.time.avatar = doc.data().avatar;
                    resolve(localUser);
                  } else {
                    console.log("No such document.");
                    reject(null);
                  }
                }).catch(e => {
                  console.log("Error getting document: ", e);
                  reject(e);
                });
            } else {
              console.log("No such document.");
              reject(null);
            }
          });
        } else {
          console.log("Error getting user", user);
          reject(null);
        }
      });
    });
  }

  logout() {
    var that = this;
    return this.afAuth.auth.signOut().then(function () {
      that.router.navigate(['/login']);
    });
  }

  resetPassword(email) {
    var that = this;
    this.afAuth.auth.languageCode = 'pt-BR';
    this.afAuth.auth.sendPasswordResetEmail(email).then(function () {
      that.toastr.info('<span class="now-ui-icons ui-1_bell-53"></span> Um email com as instruções para redefinição de senha foi enviado para ' + email, '', {
        timeOut: 8000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-top-center'
      });
    }).catch(function (error) {
      if(error == "Error: The email address is badly formatted.") {
        error = "O endereço de email está em um formato inválido";
      }
      that.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span>' + error, '', {
        timeOut: 5000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-center'
      });
    });
  }

}