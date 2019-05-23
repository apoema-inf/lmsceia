import { ContaService } from 'app/services/conta.service';
import { Conta } from 'app/models/conta.model';
import { AuthService } from 'app/services/auth.service';

declare var $: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseService } from 'app/services/firebase.service';
import { BaseChartDirective } from 'ng2-charts';
import { a } from '@angular/core/src/render3';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  inventario = { quantidade: 1, time_id: '', item_id: '' };
  extrato = { date: new Date(), tipo: '', valor: 0.0, usuario_id: 0, conta_id: 1 };
  contas: Conta[];
  itens: any[];
  user: any;
  msg: string = "";
  valor: number;
  time: any;

  primeira: boolean = false;
  segunda: boolean = false;
  terceira: boolean = false;
  quarta: boolean = false;
  quinta: boolean = false;
  sexta: boolean = false;
  setima: boolean = false;
  oitava: boolean = false;
  lideres = new Array<any>();

  //Gráfico de barras
  public barChartLabels = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  private barColors = [
    {
      backgroundColor: [
        '#c14462',
        '#41d1c1',
        '#b64d18',
        '#3f4fb8',
        '#10253a',
        '#79715f',
        '#990c06',
        '#ee6465',
        '#a0b703',
        '#1d034b',
        '#0d873a',
      ]
    }
  ];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Pontuação' }
  ];

  constructor(private contaService: ContaService, private authService: AuthService) {
    // authService.getAuth().then(user => {
    //   this.user = user;
    //   contaService.getUserConta(this.user).toPromise().then(conta => {
    //     this.contas = conta;
    //     contaService.getUserTime(this.user).toPromise().then(time => {
    //       this.time = time[0];
    //     })
    //   })
    // })
    // contaService.getItens().toPromise().then(item => {
    //   this.itens = item;
    // })
  }

  ngOnInit() {
  }

  // ifnull(valor): boolean {
  //   if (valor == null ||
  //     valor == '' ||
  //     valor == undefined) {
  //     this.msg = "Sem valor indicado";
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  //
  // credita() {
  //   if (this.ifnull(this.valor)) {
  //     this.msg = "";
  //     this.contas[0].saldo = this.contas[0].saldo + this.valor;
  //     this.contaService.updateConta(this.contas[0]).subscribe(
  //       response => {
  //         console.log(response);
  //         this.contaService.getUserConta(this.user).toPromise().then(conta => {
  //           this.contas = conta;
  //         })
  //       },
  //     );
  //   } else {
  //     return;
  //   }
  //
  // }
  //
  // saque(valor, itemID) {
  //   console.log(valor);
  //   this.inventario.item_id = itemID;
  //   this.inventario.time_id = this.time.id_time;
  //   this.extrato.date = new Date();
  //   this.extrato.tipo = 'S';
  //   this.extrato.valor = parseFloat(valor);
  //   this.extrato.usuario_id = 1;
  //   this.extrato.conta_id = this.contas[0].id_conta;
  //   if (this.ifnull(valor)) {
  //     if (this.contas[0].saldo < valor) {
  //       this.msg = "Sem limite para o saldo solicitado: " + this.contas[0].saldo;
  //       return;
  //     } else {
  //       this.msg = "";
  //       this.contas[0].saldo = this.contas[0].saldo - valor;
  //       this.contaService.setInventario(this.inventario).toPromise().then(value => {
  //         this.contaService.updateConta(this.contas[0]).subscribe(
  //           response => {
  //             this.contaService.setExtrato(this.extrato).toPromise().then(res => {
  //               this.contaService.getUserConta(this.user).toPromise().then(conta => {
  //                 this.contas = conta;
  //               })
  //             })
  //           },
  //         );
  //       })
  //     }
  //   } else {
  //     return;
  //   }
  // }

  allFalse() {
    this.primeira = false;
    this.segunda = false;
    this.terceira = false;
    this.quarta = false;
    this.quinta = false;
    this.sexta = false;
    this.setima = false;
    this.oitava = false;
  }

  toogleTemps(temp) {
    switch (temp) {
      case 1: {
        if (this.primeira) {
          this.primeira = false;
          break
        }
        else {
          this.allFalse();
          this.primeira = true;
          break;
        }

      }
      case 2: {
        if (this.segunda) {
          this.segunda = false;
          break
        }
        else {
          this.allFalse();
          this.segunda = true;
          break;
        }
      }
      case 3: {
        if (this.terceira) {
          this.terceira = false;
          break
        }
        else {
          this.allFalse();
          this.terceira = true;
          break;
        }
      }
      case 4: {
        if (this.quarta) {
          this.quarta = false;
          break
        }
        else {
          this.allFalse();
          this.quarta = true;
          break;
        }
      }
      case 5: {
        if (this.quinta) {
          this.quinta = false;
          break
        }
        else {
          this.allFalse();
          this.quinta = true;
          break;
        }
      }
      case 6: {
        if (this.sexta) {
          this.sexta = false;
          break
        }
        else {
          this.allFalse();
          this.sexta = true;
          break;
        }
      }
      case 7: {
        if (this.setima) {
          this.setima = false;
          break
        }
        else {
          this.allFalse();
          this.setima = true;
          break;
        }
      }
      case 8: {
        if (this.oitava) {
          this.oitava = false;
          break
        }
        else {
          this.allFalse();
          this.oitava = true;
          break;
        }
      }
    }
  }

  /* getAtividadesTime() {
    let pontuacao = 0;
    let nomeTime;
    let arrayTimes = [];
    let promise = new Promise((resolve, reject) => {
      this.fbs.getTimes().then(times => {
        (times as Array<any>).forEach((time, index) => {
          this.af.collection("atividadesComTime").ref.where("time", "==", time.ref).get().then(atividades => {
            atividades.forEach(atividade => {
              pontuacao += atividade.data().pontuacao;
              nomeTime = atividade.data().time.id;
            });
            arrayTimes.push({ time: nomeTime, pontuacao: pontuacao / 4 });
            pontuacao = 0;
            if (index == 10) {
              resolve(arrayTimes);
            }
          })
        });
      })
    })
    promise.then((value) => {
      arrayTimes.sort((a, b) => { return b.pontuacao - a.pontuacao; });
      arrayTimes.forEach(data => {
        this.barChartLabels.push(data.time);
        this.barChartData[0].data.push(data.pontuacao);
      });
    });
  } */
}
