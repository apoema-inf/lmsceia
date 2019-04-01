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
    this.getAtividadesTime();
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

  getAtividadesTime() {
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
  }

}
