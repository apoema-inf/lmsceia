import { Component, OnInit } from '@angular/core';
import { FirebaseAuth } from 'angularfire2';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userEmail: any;

  constructor(private authService: AuthService) {
    this.userEmail = localStorage.getItem('posgrad_user_email');
  }

  ngOnInit() {
  }

  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }
}
