import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SetupService} from '../../services/setup.service';

declare let $: any;

@Component({
  selector: 'app-self-curso',
  templateUrl: './self-curso.component.html',
  styleUrls: ['./self-curso.component.scss']
})

export class SelfCursoComponent implements OnInit, OnChanges {

  @Input() curso: any;
  ciclos: Array<number> = [];

  cicloOpen = 1;

  enfaseSelecionada = 'Background';
  conteudos: any = null;

  conteudoSelected: any = null;

  constructor(private setupService: SetupService) {

  }

  ngOnInit() {

  }

  ngOnChanges(): void {
    this.ciclos = [];
    for (let i = 1; i <= this.curso.ciclos; i++) {
      this.ciclos.push(i);
    }
  }

  setCiclo(ciclo) {
    this.cicloOpen = ciclo;
    console.log(this.cicloOpen);
  }

  setEnfase(enfase) {
    this.enfaseSelecionada = enfase;
    this.populateEnfase();
  }

  populateEnfase() {
    this.setupService.getEnfaseData(this.curso.desc, this.cicloOpen, this.enfaseSelecionada).then((documentos) => {
      this.conteudos = documentos;
      console.log(documentos);
    });
  }

  openConteudoModal(conteudo) {
    this.conteudoSelected = conteudo;
    console.log(conteudo);
    $('#content-modal').modal('show');
  }


}
