import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SetupService} from '../services/setup.service';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {

  cursoSelected: any = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private setupService: SetupService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getCursoSelected(params.curso);
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
