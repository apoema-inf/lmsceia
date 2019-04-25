import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';
import { SetupService } from 'app/services/setup.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  cursos: any;
  menuItems: any[];
  private user: Observable<firebase.User>;
  constructor(private authService: AuthService, private setupService: SetupService) {
      this.setupService.getCursosInfo().then(cursosInfo => {
        this.cursos = cursosInfo[0].cursos;
      });
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
