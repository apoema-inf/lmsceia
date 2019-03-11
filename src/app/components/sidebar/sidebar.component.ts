import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  private user: Observable<firebase.User>;
  constructor(private authService: AuthService) {
      this.user = authService.afAuth.authState;
  }

  ngOnInit() {
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };

  userOn() {
    
  }

  logout() {
    this.authService.logout();
  }
}
