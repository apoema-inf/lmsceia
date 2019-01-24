import { Component, OnInit } from '@angular/core';
import { Time } from 'app/models/time.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-times',
  templateUrl: './times.component.html',
  styleUrls: ['./times.component.scss']
})
export class TimesComponent implements OnInit {

  times: Observable<Time[]>;

  constructor(private af: AngularFirestore) {
    this.times = this.af.collection('times').snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Time;
        data.id = a.payload.doc.id;

        return data;
      });
    }));
  }

  ngOnInit() {
  }

}
