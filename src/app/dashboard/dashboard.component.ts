import { Component, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as Chartist from 'chartist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Time } from 'app/models/time.model';
import { Fase } from 'app/models/fase.model';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Membro } from 'app/models/membro.model';
import { Atividade } from 'app/models/atividade.model';
import { Missao } from 'app/models/missao.model';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AngularFirestore]
})
export class DashboardComponent implements OnInit {
  missoes: Observable<Missao[]>;
  arrayMissoes = new Array();
  arrayPontuacao = new Array();
  array = new Array();
  user: Membro = new Membro();
  timeUser: Time = new Time();
  chartLinesArray: Array<string> = ["line", "pie", "bar", "doughnut"];
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  title: string = "1ª Temporada";
  fase: string;
  times: Observable<Time[]>;
  fases: Observable<Fase[]>;
  @ViewChild("bigChart") canvas: ElementRef;
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;
  bigChartValores: Array<string> = [];
  gradient;
  chartColor: string;
  lineBigDashboardChartOptions: any;
  lineBigDashboardChartData: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[];
  lineBigDashboardChartColors: { backgroundColor: any; borderColor: string; pointBorderColor: string; pointBackgroundColor: string; pointHoverBackgroundColor: string; pointHoverBorderColor: string; }[];
  lineBigDashboardChartType: string;
  gradientChartOptionsConfiguration: any;
  labelTemporadas: string[] = [];
  gradientChartOptionsConfigurationWithNumbersAndGrid: any;
  lineBigDashboardChartLabels: string[] = [];
  lineTimeDashboardChartColors: { backgroundColor: any; borderColor: string; pointBorderColor: string; pointBackgroundColor: string; pointHoverBackgroundColor: string; pointHoverBorderColor: string; }[];
  lineChartData: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[];
  lineChartLabels: string[];
  lineChartWithNumbersAndGridColors: { borderColor: string; pointBorderColor: string; pointBackgroundColor: string; backgroundColor: any; }[];
  lineChartWithNumbersAndGridLabels: string[] = [];
  lineChartWithNumbersAndGridOptions: any;
  lineChartWithNumbersAndGridType: string;
  chartDatas: Array<any> = [];
  chartLines: Array<any> = [];
  lineChartWithNumbersAndGridData: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[];
  timeBig: boolean = false;
  lineBigDashboardChartDataAux: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[];
  modaltitle: string;
  modalbody: string;
  modalbigtitle: string;
  userEmail: string;
  guardaTimeUser: string;
  timeAtivo: string;
  atividades: Observable<Atividade[]>;

  constructor(private authService: AuthService, private af: AngularFirestore, private element: ElementRef, private router: Router) {
    var that = this;

    this.sidebarVisible = false;

    this.user = this.authService.getAuth();
    var promiseFases = new Promise(function (resolve, reject) {
      resolve(that.initFases());
      reject('erro');
    });
    var promiseTimes = new Promise(function (resolve, reject) {
      resolve(that.initTimes());
      reject('erro');
    });
    var promiseAtividades = new Promise(function (resolve, reject) {
      resolve(that.initAtividades());
      reject('erro');
    });
    var promiseMissoes = new Promise(function (resolve, reject) {
      resolve(that.initMissoes());
      reject('erro');
    })

    promiseMissoes.then(function () {
      that.fases.forEach(element => {
        element.forEach((element, index) => {
          var elementId = element.id;
          var i = index;
          that.missoes.forEach(element => {
            element.forEach((element, index) => {
              if (element.temporada.id == elementId) {
                that.labelTemporadas.push(element.nome);
              }
            })

            that.arrayMissoes[i] = that.labelTemporadas;
            that.labelTemporadas = [];
            if (i == 0) {
              that.lineBigDashboardChartLabels = that.arrayMissoes[0];
              that.lineChartWithNumbersAndGridLabels = that.lineBigDashboardChartLabels;
              that.chart.chart.update();
            }
          })

        })
      })

    })

    Promise.all([promiseFases, promiseTimes, promiseAtividades]).then(function () {

      that.fases.forEach(element => {
        element.forEach((element, index) => {
          var elementI = element;
          var i = index;
          that.array[i] = [];
          that.times.forEach((element) => {
            element.forEach((element, index) => {
              var elementJ = element;
              var j = index;
              that.array[i][j] = [];
              that.atividades.forEach((element) => {
                element.forEach((element, index) => {
                  that.array[i][j][index] = element;
                });
              });
            });
          });
        });
      });
    })
  }

  initMissoes() {
    this.missoes = this.af.collection('missoes').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Missao;

            data.id = a.payload.doc.id;

            return data;
          });
      }))

    return true;
  }

  initAtividades() {
    this.atividades = this.af.collection('atividades').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Atividade;

            data.id = a.payload.doc.id;

            return data;
          });
      }))
    return true;
  }

  initFases() {
    this.fases = this.af.collection('fases').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Fase;

            data.id = a.payload.doc.id;

            return data;
          });
      }))
    return true;
  }

  private initTimes() {
    this.times = this.af.collection('times').snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Time;
        data.id = a.payload.doc.id;
        this.chartDatas.push([
          {
            label: "Nota",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            borderWidth: 2,
            data: [this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100()]
          }
        ]);
        var randomIndex = Math.floor(Math.random() * this.chartLinesArray.length);
        this.chartLines.push(this.chartLinesArray[randomIndex]);
        return data;
      });
    }));
    return true;
  }

  private randomNumberAt100() {
    return Math.floor(Math.random() * (+100 - +0)) + +0;
  }


  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
    this.chartColor = "#FFFFFF";
    let gradientTime = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 170, 0, 50);
    gradientTime.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientTime.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));
    let gradientBig = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 200, 0, 50);
    gradientBig.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientBig.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    this.lineBigDashboardChartData = [
      {
        label: "Nota",

        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        fill: true,

        borderWidth: 2,
        data: [this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100()]
      }
    ];
    this.lineBigDashboardChartDataAux = this.lineBigDashboardChartData;
    this.lineBigDashboardChartColors = [
      {
        backgroundColor: gradientBig,
        borderColor: this.chartColor,
        pointBorderColor: this.chartColor,
        pointBackgroundColor: "#2c2c2c",
        pointHoverBackgroundColor: "#2c2c2c",
        pointHoverBorderColor: this.chartColor,
      }

    ];
    this.lineTimeDashboardChartColors = [
      {
        backgroundColor: "#000",
        borderColor: this.chartColor,
        pointBorderColor: this.chartColor,
        pointBackgroundColor: "#2c2c2c",
        pointHoverBackgroundColor: "#2c2c2c",
        pointHoverBorderColor: this.chartColor,
      },

    ];
    this.lineBigDashboardChartOptions = {
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

    this.lineBigDashboardChartType = 'line';

    this.lineChartWithNumbersAndGridColors = [
      {
        borderColor: "#18ce0f",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#18ce0f",
        backgroundColor: gradientTime
      }
    ];

    //this.chartDatas.push(this.lineChartWithNumbersAndGridData);

    this.lineChartWithNumbersAndGridOptions = {
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

    this.lineChartWithNumbersAndGridType = 'line';
  }

  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }


  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    const html = document.getElementsByTagName('html')[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }

    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');

    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];

    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const html = document.getElementsByTagName('html')[0];
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName('html')[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      html.classList.remove('nav-open');
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove('toggled');
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add('toggled');
      }, 430);

      var $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');


      if (html.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (html.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = function () { //asign a function
        html.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      html.classList.add('nav-open');
      this.mobile_menu_visible = 1;

    }
  };

  toogleFase(fase: string, index: any) {
    this.lineBigDashboardChartLabels = this.arrayMissoes[index];
    this.lineChartWithNumbersAndGridLabels = this.arrayMissoes[index];
    //this.lineBigDashboardChartData = ;
    //this.lineBigDashboardChartDataAux = ;
    //this.lineChartWithNumbersAndGridData = ;
    this.chartDatas.forEach((value, index) => {
      this.chartDatas[index] = [
        {
          label: "Nota",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          borderWidth: 2,
          data: [this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100(), this.randomNumberAt100()]
        }
      ]
    })
    this.title = fase;
  }

  toogleChartType(type: string) {
    this.lineBigDashboardChartType = type;
  }

  toogleChartTypeTime(type: string, ichart: any) {
    this.lineChartWithNumbersAndGridType = type;
    this.chartLines[ichart] = type;
  }

  goToBigChart(nomeTime: string, data: any, index: any) {
    this.lineBigDashboardChartData = data;
    this.timeBig = true;
    this.guardaTimeUser = this.user.time.id;
    this.timeAtivo = nomeTime;
  }

  backYourTime() {
    this.lineBigDashboardChartData = this.lineBigDashboardChartDataAux;
    this.timeBig = false;
    this.timeAtivo = this.guardaTimeUser;
  }

  clickHandler(evt, time) {

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
        if (time)
          this.modalbigtitle = time + ' - ' + this.title;
        else
          this.modalbigtitle = this.user.time.id + ' - ' + this.title;
        this.modaltitle = label;
        this.modalbody = value;
        console.log(clickedElementIndex, label, value)
      }
    }
  }

  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }
}
