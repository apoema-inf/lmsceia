import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ChartDataSets } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';

declare let $: any;

@Component({
  selector: 'app-time-item',
  templateUrl: './time-item.component.html',
  styleUrls: ['./time-item.component.scss']
})

export class TimeItemComponent implements OnChanges, AfterViewInit {

  @Input() atividades: any;
  @Input() time: string;
  @Input() missoes: any;
  @Output() respostaModal = new EventEmitter();
  @Output() respostaDataset = new EventEmitter();

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
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      bodySpacing: 4,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10
    },
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          zeroLineColor: "transparent",
          drawBorder: false
        }
      }],
      xAxes: [{
        display: 0,
        ticks: {
          display: false
        },
        gridLines: {
          zeroLineColor: "transparent",
          drawTicks: false,
          display: false,
          drawBorder: false
        }
      }]
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 15,
        bottom: 15
      }
    }

  };
  lineChartColors = [
    {
      borderColor: "#18ce0f",
      pointBorderColor: "#FFF",
      pointBackgroundColor: "#18ce0f",
      backgroundColor: "#fff"
    }
  ];
  lineChartLegend = true;
  lineChartType = 'line';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @ViewChild('chart') canvas: ElementRef;
  modalTitle: string;

  constructor(private firebaseService: FirebaseService) { }

  ngAfterViewInit() {
    this.gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 170, 0, 50);
    this.gradient.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradient.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));
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

  goToBigChart() {
    this.respostaDataset.emit([this.atividades, this.time]);
  }

  chartClicked(evt) {
    let atividadesModal = [];
    let modal = { title: '', pontuacao: 0, missao: '', descricao: '' };

    if (evt.active.length > 0) {
      const chart = evt.active[0]._chart;
      const activePoints = chart.getElementAtEvent(evt.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        $('.modal').modal('show');

        modal.title = this.time + ' - ' + this.firebaseService.getTemporadaEmDestaque();

        modal.missao = label;
        modal.pontuacao = value;

        this.missoes.forEach(missao => {
          if (modal.missao == missao.data().nome) {
            modal.descricao = missao.data().descricao;
            this.atividades.forEach(atividade => {
              if (atividade.missao.id == missao.id) {
                if (!(atividadesModal.includes(atividade))) {
                  atividadesModal.push(atividade);
                }
              }
            })
          }
        })
      }
    }

    this.respostaModal.emit([modal, atividadesModal]);
  }

  ngOnChanges() {
    //Setando 0 novamente para valor não acumular
    this.lineChartData[0].data = [0, 0, 0, 0];

    if (this.atividades) {
      this.setDataOnChart();
    }
  }

}