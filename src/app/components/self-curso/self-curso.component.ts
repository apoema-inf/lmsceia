import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-self-curso',
  templateUrl: './self-curso.component.html',
  styleUrls: ['./self-curso.component.scss']
})
export class SelfCursoComponent implements OnInit, OnChanges {

  @Input() curso: any;
  ciclos: Array<number> = [];

  cicloOpen: number = null;

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges(): void {
    for (let i = 1; i <= this.curso.ciclos; i++) {
      this.ciclos.push(i);
    }
  }

  cicloChanged(ciclo) {
    this.cicloOpen = ciclo;
  }

}
