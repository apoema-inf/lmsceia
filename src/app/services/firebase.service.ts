import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  temporadaDestaque: string = "1ª Temporada";

  constructor(private angularFirestore: AngularFirestore) { }

  setTemporadaEmDestaque(nome: string) {
    this.temporadaDestaque = nome;
  }

  getTemporadaEmDestaque() {
    return this.temporadaDestaque;
  }

  getTimes() {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('/times').get().toPromise().then(times => {
        let filtered = (times.docs as Array<any>).filter(el => {
          return el.id != "Dev" && el.id != "Supervisão"
        });
        resolve(filtered);
      });
    })
  }

  getTimeByUserId(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection('/membros').doc(userId).get().toPromise().then(membro => {
        resolve(membro.data().idtime);
      });
    });
  }

  getMissões(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection("missoes").ref.where("temp", "==", this.getTemporadaEmDestaque()).get().then(missoes => {
        resolve(missoes.docs);
      })
    });
  }

  getAtividadesByTime(time) {
    return new Promise((resolve, reject) => {
      this.getMissões().then(docs => {
        let missoes = docs;
        this.angularFirestore.collection('atividadesComTime').ref.where('time', '==', time).get()
          .then(docs => {
            const atividades = [];
            docs.docs.forEach(atividade => {
              missoes.forEach(missao => {
                if (atividade.data().missao.id == missao.id) {
                  atividades.push(atividade.data());
                }
              });
            });
            resolve(atividades);
          });
      })
    });
  }

  /* makeAtividadesCopyFb() {
    this.angularFirestore.collection('atividades').get().toPromise().then(atividades => {
      atividades.forEach((atividade) => {
        this.getTimeByUserId(atividade.data().membro.id).then(time => {
          const newAtividade = {
            'arquivo': atividade.data().arquivo ? atividade.data().arquivo : '', 'avaliador': atividade.data().avaliador,
            'feedback': atividade.data().feedback, 'membro': atividade.data().membro,
            'missao': atividade.data().missao, 'nome': atividade.data().nome,
            'pontuacao': atividade.data().pontuacao, 'tipo': atividade.data().tipo,
            'time': time
          };
          this.angularFirestore.collection('atividadesComTime').add(newAtividade).then((doc) => {
            console.log(doc.id + ' atualizado com sucesso!');
          }).catch(e => {
            console.log(e);
          });
        });
      });
    });
  } */

}