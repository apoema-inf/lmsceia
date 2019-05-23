import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SetupService} from '../services/setup.service';
import {SelfCursoComponent} from '../components/self-curso/self-curso.component';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {

  cursoSelected: any = null;
  isLoading = true;

  @ViewChild('selfChild') selfChild: SelfCursoComponent;

  constructor(private router: Router, private route: ActivatedRoute, private setupService: SetupService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getCursoSelected(params.curso);
    });
    this.router.events.subscribe((event) => {
      if(event.url) console.log(event.url);
      this.selfChild.loadLogoImage();
    });
  }

  getCursoSelected(curso: string) {
    console.log(curso);
    this.setupService.getCursosInfo().then(info => {
      this.cursoSelected = info[0].cursos.find(cur => {
        return cur.desc === curso;
      });
      this.isLoading = false;
    });
  }

}
