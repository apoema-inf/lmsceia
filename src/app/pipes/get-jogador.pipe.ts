import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Pipe({
  name: 'getJogador'
})
export class GetJogadorPipe implements PipeTransform {

  constructor(private af: AngularFirestore) { }

  transform(value: any, args?: any): any {
    //Receber um membro que fez a atividade
    return this.af.collection("membros").doc(value).get().toPromise().then(function (doc) {
      if (doc.exists) {
        return doc.data().nome;
      } else {
        // doc.data() will be undefined in this case
        return "Sem jogador";
      }
    }).catch(function (error) {
      return error;
    });
  }

}
