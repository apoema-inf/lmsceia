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

  cicloSelecionado: number = null;

  enfaseSelecionada = '';
  materias: Array<any> = [];
  conteudos: Array<any> = [];
  atividades: Array<any> = [];

  materiaSelected: any = null;

  noContent = false;

  isLoadingMaterias = false;

  constructor(private setupService: SetupService) {

  }

  ngOnInit() {

  }

  ngOnChanges(): void {
    this.ciclos = [];
    for (let i = 1; i <= this.curso.ciclos; i++) {
      this.ciclos.push(i);
    }
    this.setCiclo(this.cicloSelecionado);
  }

  setCiclo(ciclo) {
    this.cicloSelecionado = ciclo;
    console.log(this.cicloSelecionado);
    this.setEnfase(this.enfaseSelecionada);
  }

  setEnfase(enfase) {
    this.enfaseSelecionada = enfase;
    this.populateEnfase();
  }

  populateEnfase() {
    this.isLoadingMaterias = true;
    this.atividades = [];
    this.conteudos = [];
    this.setupService.getEnfaseData(this.curso.desc, this.cicloSelecionado, this.enfaseSelecionada).then((documentos) => {
      this.materias = documentos;
      documentos.forEach(documento => {
          if (documento.arrayObjAprendizagem.length > 0) {
            documento.arrayObjAprendizagem.forEach(objeto => {
              if (objeto.tipo === 'C' && (this.materiaSelected && documento.nome === this.materiaSelected.nome)) { this.conteudos.push(objeto); }
              else if (objeto.tipo === 'A' && (this.materiaSelected && documento.nome === this.materiaSelected.nome)) { this.atividades.push(objeto); }
            });
          } else {
            this.noContent = true;
          }
      });
      this.isLoadingMaterias = false;
    });
  }

  openConteudoModal(materia) {
    this.materiaSelected = materia;
    this.populateEnfase();
    console.log(materia);
    $('#content-modal').modal('show');
  }


}
