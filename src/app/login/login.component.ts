import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string;
  private password: string;
  private user: Observable<firebase.User>;

  constructor(
    private authService: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.user = authService.afAuth.authState;
  }

  ngOnInit() {
  }

  onSubmitLogin() {
    if (this.validaCampos()) {
      var that = this;
      // Show full page LoadingOverlay
      $.LoadingOverlay("show");
      this.authService.loginEmail(this.email, this.password)
        .then((res) => {
          $.LoadingOverlay("hide");
          that.router.navigate(['/dashboard']);
        }).catch((err) => {
          $.LoadingOverlay("hide");
          that.router.navigate(['/login']);
        });
    }
    else {
      return;
    }

  }
  validaCampos(): boolean {
    if (this.email.length < 0) {
      this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Preencha o campo email.', '', {
        timeOut: 5000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-center'
      });
      return false;
    }
    else if (this.email == (null || '')) {
      this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Preencha o campo email.', '', {
        timeOut: 5000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-center'
      });
      return false;
    } else if (this.password == (null || '' || undefined)) {
      this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Preencha o campo senha.', '', {
        timeOut: 5000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-center'
      });
      return false;

    } else if (this.password.length < 6) {
      this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Campo senha deve ter no mínimo 6 caracteres.', '', {
        timeOut: 5000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-center'
      });
      return false;
    } else {
      return true;
    }
  }

  resetPassword() {
    if (this.email == undefined || this.email.length < 0 || this.email == null) {
      this.toastr.error('<span class="now-ui-icons ui-1_bell-53"></span> Preencha o campo email.', '', {
        timeOut: 5000,
        enableHtml: true,
        closeButton: false,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-center'
      });
      return;
    }
    else {
      this.authService.resetPassword(this.email);
    }
  }

}
