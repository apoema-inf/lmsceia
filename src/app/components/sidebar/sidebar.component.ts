import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  admins: Array<any> = new Array();
  emailUsuario: string;
  private user: Observable<firebase.User>;
  constructor(private authService: AuthService, private firebaseService: FirebaseService) {
    this.user = authService.afAuth.authState;
    this.user.subscribe(user => {
      this.emailUsuario = user.email;
      this.firebaseService.getMetaDados().then(infos => {
        this.admins = infos.admins;
      })
    });

  }

  ngOnInit() {
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
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
