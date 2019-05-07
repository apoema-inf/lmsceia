import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastrService } from 'ngx-toastr';
import { ObjAprendizagem } from 'app/models/objaprendizagem.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminGuard } from 'app/services/admin-guard.service';
import { FirebaseService } from 'app/services/firebase.service';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  formulario: FormGroup;
  formularioEdicao: FormGroup;
  arrayObjAprendizagem: FormArray;
  arrayObjAprendizagemEdicao: FormArray;
  itens: Observable<ObjAprendizagem[]>;
  idItem: String;
  arrayDados: Array<any> = new Array();
  arrayCiclos: Array<any> = new Array();
  arrayEnfase: Array<any> = new Array();
  flagModalEditar: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private af: AngularFirestore,
    private toastr: ToastrService,
    private afs: FirebaseService
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

    this.buscaMetaDados();

  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      img: [null, Validators.required],
      enfase: ['Enfase', Validators.required],
      ciclo: ['Ciclo', Validators.required],
      formacao: ['Formação', Validators.required],
      arrayObjAprendizagem: this.formBuilder.array([this.criarItem()])
    });

    this.formulario.controls.ciclo.disable();
    this.formulario.controls.enfase.disable();

    this.formularioEdicao = this.formBuilder.group({
      nome: [null, Validators.required],
      img: [null, Validators.required],
      enfase: ['Enfase', Validators.required],
      ciclo: ['Ciclo', Validators.required],
      formacao: ['Formação', Validators.required],
      arrayObjAprendizagemEdicao: this.formBuilder.array([this.criarItem()])
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
    }).catch(err => {
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
      tipo: '',
      formato: ''
    });
  }

  acrescentaLinha() {
    this.arrayObjAprendizagem = this.formulario.get('arrayObjAprendizagem') as FormArray;
    this.arrayObjAprendizagem.push(this.criarItem());
  }

  decrementaLinha(id) {
    this.arrayObjAprendizagem = this.formulario.get('arrayObjAprendizagem') as FormArray;
    this.arrayObjAprendizagem.removeAt(id);
  }

  onSubmit() {
    //valida os campos do formulário
    if (this.validaFormulario()) {
      return;
    }

    //atribui valor default para img card
    if (this.formulario.controls.img.value == null || this.formulario.controls.img.value == '') {
      this.formulario.controls.img.setValue("https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/img%2Fnoimage.jpg?alt=media&token=0c4ff4f5-0851-46c4-8e8b-11d2bac0176c");
    }

    let objCard = {
      nome: this.formulario.controls.nome.value,
      img: this.formulario.controls.img.value,
      enfase: this.formulario.controls.enfase.value,
      ciclo: this.formulario.controls.ciclo.value,
      formacao: this.formulario.controls.formacao.value,
      arrayObjAprendizagem: this.formulario.controls.arrayObjAprendizagem.value
    };

    this.af.collection("self").add(objCard).then(value => {
      //console.log(value);
      this.formulario.reset();
      this.putValuesOnSelect();
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

  validaFormulario() {
    let obj = {
      timeOut: 0,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-warning alert-with-icon",
      positionClass: 'toast-' + 'top' + '-' + 'center'
    };

    if (this.formulario.controls.nome.value == null || this.formulario.controls.nome.value == '') {
      this.toastr.warning('O campo Nome não foi informado.', '', obj);
      return true;
    }

    if (this.formulario.controls.formacao.value == 'Formação') {
      this.toastr.warning('O campo Formação não foi informado.', '', obj);
      return true;
    }

    if (this.formulario.controls.ciclo.value == 'Ciclo') {
      this.toastr.warning('O campo Ciclo não foi informado.', '', obj);
      return true;
    }

    if (this.formulario.controls.enfase.value == 'Enfase') {
      this.toastr.warning('O campo Enfase não foi informado.', '', obj);
      return true;
    }
  }

  putValuesOnSelect() {
    this.formulario.controls.formacao.setValue("Formação");
    this.formulario.controls.ciclo.setValue("Ciclo");
    this.formulario.controls.enfase.setValue("Enfase");
    //desabilita os campos
    this.formulario.controls.ciclo.disable();
    this.formulario.controls.enfase.disable();
  }

  editarConteudo(id, flagEditar) {
    var docRef = this.af.collection("self").doc(id);
    this.idItem = id;
    this.flagModalEditar = true;
    docRef.ref.get().then(doc => {
      if (doc.exists) {
        this.formularioEdicao.controls.nome.setValue(doc.data().nome);
        this.formularioEdicao.controls.img.setValue(doc.data().img);
        this.formularioEdicao.controls.formacao.setValue(doc.data().formacao);
        this.buscaCiclosEnfase(doc.data().formacao);
        this.formularioEdicao.controls.ciclo.setValue(doc.data().ciclo);
        this.formularioEdicao.controls.enfase.setValue(doc.data().enfase);

        let material = this.formBuilder.array([]);
        doc.data().arrayObjAprendizagem.forEach(element => {
          material.push(this.formBuilder.group(element));
        });
        this.formularioEdicao.controls.arrayObjAprendizagemEdicao = material;
      }
    });
  }

  acrescentaLinhaModalEdicao() {
    this.arrayObjAprendizagemEdicao = this.formularioEdicao.get('arrayObjAprendizagemEdicao') as FormArray;
    this.arrayObjAprendizagemEdicao.push(this.criarItem());
  }

  decrementaLinhaModalEdicao(id) {
    this.arrayObjAprendizagemEdicao = this.formularioEdicao.get('arrayObjAprendizagemEdicao') as FormArray;
    this.arrayObjAprendizagemEdicao.removeAt(id);
  }

  updateForm() {
    if (this.validaEditarFormulario()) {
      return;
    }

    let docRef = this.af.collection("self").doc(this.idItem.toString());

    docRef.update({
      nome: this.formularioEdicao.controls.nome.value,
      img: this.formularioEdicao.controls.img.value,
      enfase: this.formularioEdicao.controls.enfase.value,
      ciclo: this.formularioEdicao.controls.ciclo.value,
      formacao: this.formularioEdicao.controls.formacao.value,
      arrayObjAprendizagem: this.formularioEdicao.controls.arrayObjAprendizagemEdicao.value
    }).then(value => {
      this.toastr.success('Card editado com sucesso!', '', {
        timeOut: 0,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
        positionClass: 'toast-' + 'top' + '-' + 'center'
      });
      this.flagModalEditar = false;
      $('#editarModal').modal('hide');
    })
      .catch(error => {
        console.log(error);
        this.toastr.warning(error.message, '', {
          timeOut: 0,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-warning alert-with-icon",
          positionClass: 'toast-' + 'top' + '-' + 'center'
        });
      });
  }

  validaEditarFormulario() {
    let obj = {
      timeOut: 0,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-warning alert-with-icon",
      positionClass: 'toast-' + 'top' + '-' + 'center'
    };

    if (this.formularioEdicao.controls.nome.value == null || this.formularioEdicao.controls.nome.value == '') {
      this.toastr.warning('O campo Nome não foi informado.', '', obj);
      return true;
    }

    if (this.formularioEdicao.controls.img.value == null || this.formularioEdicao.controls.img.value == '') {
      this.toastr.warning('O campo Link da Imagem não foi informado.', '', obj);
      return true;
    }

    if (this.formularioEdicao.controls.formacao.value == 'Formação') {
      this.toastr.warning('O campo Formação não foi informado.', '', obj);
      return true;
    }

    if (this.formularioEdicao.controls.ciclo.value == 'Ciclo') {
      this.toastr.warning('O campo Ciclo não foi informado.', '', obj);
      return true;
    }

    if (this.formularioEdicao.controls.enfase.value == 'Enfase') {
      this.toastr.warning('O campo Enfase não foi informado.', '', obj);
      return true;
    }
  }

  buscaMetaDados() {
    return new Promise((resolve, reject) => {
      this.afs.getMetaDados().then(dados => {
        dados.cursos.forEach(element => {
          this.arrayDados.push(element);
        });

        resolve(this.arrayDados);
      })
    })
  }

  buscaCiclosEnfase(descCurso) {
    //Quando o usuário trocar o curso limpa os campos de Ciclo e Enfase
    this.arrayCiclos = [];

    //Se estiver alterando os valores dos campos da modal editar
    if (this.flagModalEditar) {
      this.formularioEdicao.controls.ciclo.setValue("Ciclo");
      this.formularioEdicao.controls.enfase.setValue("Enfase");
    } else {
      this.formulario.controls.ciclo.setValue("Ciclo");
      this.formulario.controls.enfase.setValue("Enfase");
    }

    //Busca os ciclos e enfase de acordo com o curso selecionado
    this.arrayDados.forEach(element => {
      if (element.desc === descCurso) {
        for (var i = 1; i <= element.ciclos; i++) {
          this.arrayCiclos.push("Ciclo " + i.toString());
        }
        this.arrayEnfase = element.enfases;

        //Se for alterações no modal de editar card
        if (this.flagModalEditar) {
          this.formularioEdicao.controls.ciclo.enable();
          this.formularioEdicao.controls.enfase.enable();
        } else {
          this.formulario.controls.ciclo.enable();
          this.formulario.controls.enfase.enable();
        }

      }
    });
  }

  setFlagModalEditar() {
    this.flagModalEditar = false;
  }
}
