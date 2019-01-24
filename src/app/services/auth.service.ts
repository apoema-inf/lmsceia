import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from "rxjs/operators";
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) { }

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
          localStorage.setItem('posgrad_user_email', userData.user.email);
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
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  logout() {
    var that = this;
    return this.afAuth.auth.signOut().then(function () {
      localStorage.removeItem('posgrad_user_email');
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