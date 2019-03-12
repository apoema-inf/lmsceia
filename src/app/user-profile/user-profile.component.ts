import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Membro } from 'app/models/membro.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: Membro = new Membro();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuth().then( user => {
      this.user = user as Membro;
    });
  }

}
