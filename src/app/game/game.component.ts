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

  primeira: boolean = false;
  segunda: boolean = false;
  terceira: boolean = false;
  quarta: boolean = false;
  quinta: boolean = false;
  sexta: boolean = false;
  setima: boolean = false;
  oitava: boolean = false;
  lideres: Array<any> = new Array();

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

  //Gráfico de barras
  public barChartLabels = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  constructor(private af: AngularFirestore, private fbs: FirebaseService) {
    /* this.getAtividadesTime(); */
    this.lideres.push({nome: 'Francisco Lucas da Silva', time: 'Time #01', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-01%2FFrancisco%20Lucas%20da%20Silva%20-%20AsaNoturna.png?alt=media&token=2c4e3b01-22ef-4082-a2af-d69a5e06c446'});
    this.lideres.push({nome: 'Felipe Neves Rocha da Silva', time: 'Time #02', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-02%2FFelipe%20-%20Sir_Lipitos.png?alt=media&token=3de5aeb7-1ad7-4cfa-8467-fa5b2de1b7d2'});
    this.lideres.push({nome: 'Gadiel Ribeiro De Almeida', time: 'Time #03', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-03%2FGadigas.jpg?alt=media&token=64e14be8-e641-4477-b69d-e5aac91a564e'});
    this.lideres.push({nome: 'Lauriana Alves Moreira', time: 'Time #04', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-04%2FLaur%C3%ADssima.jpeg?alt=media&token=0e4b9772-4ce1-45bf-8764-6914fb597284'});
    this.lideres.push({nome: 'Fernando Teles Da Silva Mesquita', time: 'Time #05', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-05%2F%20Fernando%20Teles%20-%20Teles.jpeg?alt=media&token=c27abc5c-3423-4960-9d6a-5ed6d89b09e2'});
    this.lideres.push({nome: 'Rodolfo Wenceslau Mota', time: 'Time #06', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-06%2FRodolfo%20Wenceslau.jpeg?alt=media&token=edc2d2bc-bf9b-4186-8060-9aabbdab5b77'});
    this.lideres.push({nome: 'Eduardo Koelln', time: 'Time #07', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-07%2FMagr%C3%A3o.jpeg?alt=media&token=c5b91cfd-b198-44f7-b98e-54a978cbd45b'});
    this.lideres.push({nome: 'Lorena Brandão Romeiro', time: 'Time #09', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-09%2FAvatar%20-%20Loris%20-%20Lorena.jpg?alt=media&token=285802e0-01f8-4419-ab57-bb158cefac42'});
    this.lideres.push({nome: 'Anderson de Oliveira Costa', time: 'Time #10', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-10%2FAnderson-TCHUY.jpeg?alt=media&token=8b95537d-d237-4a79-8382-192822109ef8'});
    this.lideres.push({nome: 'Matheus Silva Santos', time: 'Time #11', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-11%2FMatheus%20Santos.png?alt=media&token=2705bbd8-aee3-4e5b-aaf6-7ff80dbfab81'});
    this.lideres.push({nome: 'Franceles Bezerra De Oliveira', time: 'Time #12', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-12%2FFranceles%20ser%C3%A1%20Nubes%20(nuvem).jpeg?alt=media&token=74283092-5cd5-4399-bc82-aecc54bf68d2'});
  }

  ngOnInit() {
  }

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
