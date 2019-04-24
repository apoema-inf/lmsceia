import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastrService } from 'ngx-toastr';
import { ObjAprendizagem } from 'app/models/objaprendizagem.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  formulario: FormGroup;
  conteudos: FormArray;
  itens: Observable<ObjAprendizagem[]>;

  constructor(
    private formBuilder: FormBuilder,
    private af: AngularFirestore,
    private toastr: ToastrService
  ) {
    this.itens = this.af.collection('self').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as ObjAprendizagem;

            data.id = a.payload.doc.id;

            return data;
          });
      }))

  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      img: [null, Validators.required],
      enfase: ['Categoria', Validators.required],
      ciclo: ['Onda', Validators.required],
      formacao: ['Curso', Validators.required],
      conteudos: this.formBuilder.array([this.criarItem()])
    });
  }

  excluirConteudo(id) {
    this.af.collection("self").doc(id).delete().then(value => {
      this.toastr.success('Conteúdo excluído com sucesso!', '', {
        timeOut: 0,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
        positionClass: 'toast-' + 'top' + '-' + 'center'
      });
    }).catch (err => {
      this.toastr.warning(err.message, '', {
        timeOut: 0,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-warning alert-with-icon",
        positionClass: 'toast-' + 'top' + '-' + 'center'
      });
    })
  }

  criarItem() {
    return this.formBuilder.group({
      nome: '',
      link: '',
      tipo: 'Tipo'
    });
  }

  acrescentaInput() {
    this.conteudos = this.formulario.get('conteudos') as FormArray;
    this.conteudos.push(this.criarItem());
  }

  decrementaInput() {
    this.conteudos = this.formulario.get('conteudos') as FormArray;
    this.conteudos.removeAt(this.conteudos.length - 1);
  }

  onSubmit() {
    this.af.collection("self").add({
      nome: this.formulario.controls.nome.value,
      img: this.formulario.controls.img.value,
      enfase: this.formulario.controls.enfase.value,
      ciclo: this.formulario.controls.ciclo.value,
      formacao: this.formulario.controls.formacao.value,
      conteudos: this.formulario.controls.conteudos.value
    }).then(value => {
      console.log(value);
      this.formulario.reset();
      this.toastr.success('Conteúdo criado com sucesso!', '', {
        timeOut: 0,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
        positionClass: 'toast-' + 'top' + '-' + 'center'
      });
    }).catch(err => {
      console.log(err);
      this.toastr.warning(err.message, '', {
        timeOut: 0,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-warning alert-with-icon",
        positionClass: 'toast-' + 'top' + '-' + 'center'
      });
    })
  }

  resetar() {
    this.formulario.reset();
  }

}
