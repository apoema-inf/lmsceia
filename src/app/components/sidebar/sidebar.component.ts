import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';
import { SetupService } from 'app/services/setup.service';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  cursos: any;
  private user: Observable<firebase.User>;
  menuItems: any[];

  constructor(private authService: AuthService, private setupService: SetupService, private firebaseService: FirebaseService) {
    this.setupService.getCursosInfo().then(cursosInfo => {
      this.cursos = cursosInfo[0].cursos;
    });

    authService.afAuth.authState.subscribe(user => {
      this.firebaseService.getMetaDados().then(infos => {
        if (infos.admins.includes(user.email)) {
          this.user = authService.afAuth.authState;
        } else {
          this.user = null;
        }
      })
    });
  }

  openCurso() {
    this.setupService.isLoadingImage = true;
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };

  logout() {
    this.authService.logout();
  }
}
