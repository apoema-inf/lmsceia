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
  admins: Array<any> = new Array();
  emailUsuario: string;

  constructor(private authService: AuthService, private setupService: SetupService, private firebaseService: FirebaseService) {
      this.setupService.getCursosInfo().then(cursosInfo => {
        this.cursos = cursosInfo[0].cursos;
      });
      this.user = authService.afAuth.authState;
      this.user.subscribe(user => {
        this.emailUsuario = user.email;
        this.firebaseService.getMetaDados().then(infos => {
          this.admins = infos.admins;
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
