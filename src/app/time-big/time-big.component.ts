import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ChartDataSets } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-time-big',
  templateUrl: './time-big.component.html',
  styleUrls: ['./time-big.component.scss']
})
export class TimeBigComponent implements OnChanges, AfterViewInit {
  @Input() atividades: any;
  @Input() missoes: any;
  @Input() flag: boolean = false;
  @Input() time: string = '';
  @Output() respostaVoltar = new EventEmitter();

  gradient: any;
  lineChartData: ChartDataSets[] = [
    {
      data: [0, 0, 0, 0],
      pointBorderWidth: 2,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 1,
      pointRadius: 4,
      fill: true,
      borderWidth: 2,
      label: 'Pontuação'
    }
  ];
  lineChartLabels: Label[] = ['Missão Passport', 'Missão Curiosity', 'Missão Discovery', 'Missão Startup'];
  lineChartOptions = {
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 0,
        bottom: 0
      }
    },
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: '#fff',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    legend: {
      position: "bottom",
      fillStyle: "#FFF",
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: "rgba(255,255,255,0.4)",
          fontStyle: "bold",
          beginAtZero: true,
          maxTicksLimit: 5,
          padding: 10
        },
        gridLines: {
          drawTicks: true,
          drawBorder: false,
          display: true,
          color: "rgba(255,255,255,0.1)",
          zeroLineColor: "transparent"
        }

      }],
      xAxes: [{
        gridLines: {
          zeroLineColor: "transparent",
          display: false,

        },
        ticks: {
          padding: 10,
          fontColor: "rgba(255,255,255,0.4)",
          fontStyle: "bold"
        }
      }]
    }
  };
  
  lineChartColors = [
    {
      backgroundColor: this.gradient,
      borderColor: '#fff',
      pointBorderColor: '#fff',
      pointBackgroundColor: "#2c2c2c",
      pointHoverBackgroundColor: "#2c2c2c",
      pointHoverBorderColor: '#fff',
    }
  ];
  lineChartLegend = true;
  lineChartType = 'line';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @ViewChild('chart') canvas: ElementRef;

  constructor(private firebaseService: FirebaseService) { }

  ngAfterViewInit() {
    this.gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 200, 0, 50);
    this.gradient.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradient.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    this.lineChartColors[0].backgroundColor = this.gradient;
  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  findAtividadeByMissaoId(missaoNome: string, missaoId: string, index: number) {
    this.atividades.forEach(atividade => {
      if (atividade.missao.id == missaoId) {
        switch (missaoNome) {
          case "Missão Passport": {
            this.lineChartData[0].data[0] = this.lineChartData[0].data[0]
              + atividade.pontuacao;
            break;
          }
          case "Missão Curiosity": {
            this.lineChartData[0].data[1] = this.lineChartData[0].data[1]
              + atividade.pontuacao;
            break;
          }
          case "Missão Discovery": {
            this.lineChartData[0].data[2] = this.lineChartData[0].data[2]
              + atividade.pontuacao;
            break;
          }
          case "Missão Startup": {
            this.lineChartData[0].data[3] = this.lineChartData[0].data[3]
              + atividade.pontuacao;
            break;
          }
        };
      }
    });
  }

  setDataOnChart() {
    this.missoes.forEach((missao, index) => {
      this.findAtividadeByMissaoId(missao.data().nome, missao.id, index);
    });
    this.chart.update();
  }

  toogleChartType(tipo: string) {
    this.lineChartType = tipo;
  }

  backYourTime() {
    this.respostaVoltar.emit(false);
  }

  ngOnChanges() {
    //Setando 0 novamente para valor não acumular
    this.lineChartData[0].data = [0, 0, 0, 0];
    
    if (this.atividades) {
      this.setDataOnChart();
    }
  }
}
