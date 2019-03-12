import { Component, OnInit } from '@angular/core';
import { Time } from 'app/models/time.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AuthService } from 'app/services/auth.service';

declare let $: any;

@Component({
  selector: 'app-times',
  templateUrl: './times.component.html',
  styleUrls: ['./times.component.scss']
})
export class TimesComponent implements OnInit {

  //Todos os times
  times: Observable<Time[]>;

  //User logado e seu time/membros
  user: any;
  membros: {};

  //Time/membro que vai para o modal
  time: Time = new Time;
  membrosTimeFound: {};
  
  constructor(private af: AngularFirestore, private authService: AuthService) {
    $.LoadingOverlay("show");
    this.times = this.af.collection('times').snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Time;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    this.authService.getAuth().then(user => {
      this.user = user;
      $.LoadingOverlay("hide");
      this.authService.getUsersByTime(this.user.time).then(membros => {
        this.membros = membros;
      });
    });
  }

  ngOnInit() {
  }

  findTime(time) {
    $("#timeDetalhe").LoadingOverlay("show");
    this.time = time;
    this.authService.getUsersByTime(time).then(membros => {
      this.membrosTimeFound = membros;
      $("#timeDetalhe").LoadingOverlay("hide");
    });
  }

}
