import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app'},
    { path: '/self-service', title: 'Self-Service',  icon:'shopping_box'},
    { path: '/break-news', title: 'Break-News',  icon:'education_paper'},
    { path: '/notifications', title: 'Notificações',  icon:'ui-1_bell-53'},
    { path: '/timework', title: 'Timework',  icon:'location_map-big'},
    { path: '/game', title: 'Game',  icon:'tech_controller-modern'}
];

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
    this.menuItems = ROUTES.filter(menuItem => menuItem);
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
