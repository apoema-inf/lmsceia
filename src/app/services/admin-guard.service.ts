import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authService.afAuth.authState.subscribe(user => {
      this.firebaseService.getMetaDados().then(infos => {
        if (!infos.admins.includes(user.email)) {
          this.router.navigate(['/dashboard'])
        }
      })
    })
    return true;
  }

}