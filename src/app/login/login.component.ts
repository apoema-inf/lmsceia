import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string;
  private password: string;

  constructor(
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitLogin() {
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

}
