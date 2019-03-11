import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  indexTimeUser: number = 0;
  indexTemporada: number = 0;
  missoes: Observable<Missao[]>;
  arrayMissoes = new Array();
  timeUserPontuacao = new Array();
  timesPontuacao = new Array();
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
  bigChartValores: Array<string> = [];
  gradient;
  chartColor: string;
  lineBigDashboardChartOptions: any;
  lineBigDashboardChartData: any[];
  lineBigDashboardChartColors: { backgroundColor: any; borderColor: string; pointBorderColor: string; pointBackgroundColor: string; pointHoverBackgroundColor: string; pointHoverBorderColor: string; }[];
  lineBigDashboardChartType: string;
  gradientChartOptionsConfiguration: any;
  labelTemporadas: string[] = [];
  dataAtividades: number[] = [];
  gradientChartOptionsConfigurationWithNumbersAndGrid: any;
  lineBigDashboardChartLabels: string[] = [];
  lineTimeDashboardChartColors: { backgroundColor: any; borderColor: string; pointBorderColor: string; pointBackgroundColor: string; pointHoverBackgroundColor: string; pointHoverBorderColor: string; }[];
  lineChartData: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[];
  lineChartLabels: string[];
  lineChartWithNumbersAndGridColors: { borderColor: string; pointBorderColor: string; pointBackgroundColor: string; backgroundColor: any; }[];
  lineChartWithNumbersAndGridOptions: any;
  lineChartWithNumbersAndGridType: string;
  chartDatas: Array<any[]> = new Array();
  chartLines: Array<any> = [];
  lineChartWithNumbersAndGridData: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[];
  timeBig: boolean = false;
  lineBigDashboardChartDataAux: { label: string; pointBorderWidth: number; pointHoverRadius: number; pointHoverBorderWidth: number; pointRadius: number; fill: boolean; borderWidth: number; data: number[]; }[] = [];
  modaltitle: string;
  modalbody: string;
  modalbigtitle: string;
  userEmail: string;
  guardaTimeUser: string;
  timeAtivo: string;
  atividades: Observable<Atividade[]>;
  atividadesPoint: Array<Atividade> = new Array();
  timeUserPontuacaoBigData = [
    {
      label: "Pontuação",
      pointBorderWidth: 2,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 1,
      pointRadius: 4,
      fill: true,
      borderWidth: 2,
      data: []
    }
  ];
  descricao: any;
  nome: any;
  pontuacao: any;

  constructor(private authService: AuthService, private af: AngularFirestore, private element: ElementRef, private router: Router) {
    var that = this;

    this.lineBigDashboardChartData = [
      {
        label: "Pontuação",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 2,
        data: [this.randomNumberAt100()]
      }
    ];

    this.sidebarVisible = false;

    this.authService.getAuth().then(user => {
      this.user = user as Membro;
    });

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

    Promise.all([promiseMissoes, promiseFases]).then(function () {
      that.fases.forEach(element => {
        element.forEach((element, index) => {
          var fase = element;
          var i = index;
          that.missoes.forEach(element => {
            var missao = element;
            element.forEach((element, index) => {
              if (missao[index].temporada.id == fase.id) {
                that.labelTemporadas.push(missao[index].nome);
              }
            })

            that.arrayMissoes[i] = that.labelTemporadas;
            that.labelTemporadas = [];
            if (i == 0) {
              that.lineBigDashboardChartLabels = that.arrayMissoes[0];
              that.chart.chart.update();
            }
          })

        })
      })

    })

    //Dado para o time do usuário
    Promise.all([promiseAtividades, promiseMissoes, promiseTimes, promiseFases]).then(function () {
      that.fases.forEach(element => {
        element.forEach((element, index) => {
          //Temporadas aparecendo aqui
          var temporada = element;
          var i = index;
          that.timeUserPontuacao[i] = [];
          that.missoes.forEach(element => {
            element.forEach((element, index) => {
              //Missões aparecendo aqui
              var missao = element;
              var k = index;
              //Verifica se a missão é daquela temporada
              if (element.temporada.id == temporada.id) {

                that.atividades.forEach(element => {
                  that.timeUserPontuacao[i][k] = 0;
                  element.forEach(element => {
                    var timeDoMembro;
                    //Atividades aparecendo aqui

                    //Receber um membro que fez a atividade
                    that.af.collection("membros").doc(element.membro.id).get().toPromise().then(function (doc) {
                      if (doc.exists) {
                        //Verifica se a atividade pertente a missão
                        that.authService.getUserTimeId().then(function (value) {
                          if (element.missao.id == missao.id && value == doc.data().idtime.id) {
                            that.timeUserPontuacao[i][k] += Number(element.pontuacao);
                            that.setData(0);
                          }
                        })

                      } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                      }
                    }).catch(function (error) {
                      console.log("Error getting document:", error);
                    });

                  })
                });
              }
            })
          })

        })
      })
    })

    //Dado para os times
    Promise.all([promiseAtividades, promiseMissoes, promiseTimes, promiseFases]).then(function () {
      that.fases.forEach(element => {
        element.forEach((element, index) => {
          //Temporadas aparecendo aqui
          var temporada = element;
          var i = index;
          that.timesPontuacao[i] = [];
          that.times.forEach(element => {
            element.forEach((time, j) => {
              that.timesPontuacao[i][j] = [];
              that.missoes.forEach(element => {
                element.forEach((element, k) => {
                  //Missões aparecendo aqui
                  var missao = element;
                  //Verifica se a missão é daquela temporada
                  if (element.temporada.id == temporada.id) {

                    that.atividades.forEach(element => {
                      that.timesPontuacao[i][j][k] = 0;
                      element.forEach(element => {
                        var timeDoMembro;
                        //Atividades aparecendo aqui

                        //Receber um membro que fez a atividade
                        that.af.collection("membros").doc(element.membro.id).get().toPromise().then(function (doc) {
                          if (doc.exists) {
                            timeDoMembro = doc.data().idtime.id;
                            //Verifica se a atividade pertente a missão
                            if (element.missao.id == missao.id && timeDoMembro == time.id) {
                              that.timesPontuacao[i][j][k] += Number(element.pontuacao);
                              that.setDataTimes(0);
                            }
                          } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                          }
                        }).catch(function (error) {
                          console.log("Error getting document:", error);
                        });

                      })
                    })
                  }
                })
              })
            })
          })
        })
      })
    }).then(function () {
      that.initSetDataTimes();
    })

  }

  initMissoes() {
    this.missoes = this.af.collection('missoes', ref => ref.orderBy('order', 'asc')).snapshotChanges().pipe(map(

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
    this.times = this.af.collection('times').snapshotChanges().pipe(map((changes, i) => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Time;
        data.id = a.payload.doc.id;

        this.chartLines.push('line');
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
    this.setData(index);
    this.setDataTimes(index);
    this.indexTemporada = index;
    this.lineBigDashboardChartLabels = this.arrayMissoes[index];

    this.title = fase;
  }

  toogleChartType(type: string) {
    this.lineBigDashboardChartType = type;
  }

  toogleChartTypeTime(type: string, ichart: any) {
    this.lineChartWithNumbersAndGridType = type;
    this.chartLines[ichart] = type;
  }

  goToBigChart(nomeTime: string, data: any) {
    this.chartTypeLine();
    this.lineBigDashboardChartDataAux[0] = this.timeUserPontuacaoBigData[0];
    this.timeUserPontuacaoBigData[0] = data;
    this.timeBig = true;
    this.guardaTimeUser = this.user.time.id;
    this.timeAtivo = nomeTime;
  }

  private chartTypeLine() {
    if (this.lineBigDashboardChartType == 'bar') {
      this.lineBigDashboardChartType = 'line';
    }
    else {
      this.lineBigDashboardChartType = 'bar';
    }
  }

  backYourTime() {
    this.chartTypeLine();
    this.timeUserPontuacaoBigData[0] = this.lineBigDashboardChartDataAux[0];
    this.timeBig = false;
    this.timeAtivo = this.guardaTimeUser;
  }

  clickHandler(evt, time) {

    var that = this;
    this.atividadesPoint = [];

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
        else {
          if (this.timeBig)
            this.modalbigtitle = this.timeAtivo + ' - ' + this.title;
          else
            this.modalbigtitle = this.user.time.id + ' - ' + this.title;
        }
        this.nome = label;
        this.pontuacao = value;

        var promiseMissoes = new Promise(function (resolve, reject) {
          that.initMissoes();
          that.initAtividades();
          resolve('ok');
          reject('erro');
        })

        promiseMissoes.then(function () {
          that.missoes.forEach(element => {
            element.forEach(missao => {
              if (that.nome == missao.nome) {
                that.descricao = missao.descricao;
                that.atividades.forEach(element => {
                  element.forEach(atividade => {
                    if (atividade.missao.id == missao.id) {
                      if (!(that.atividadesPoint.includes(atividade))) {
                        that.atividadesPoint.push(atividade);
                      }
                    }
                  })
                })
              }
            })
          })
        })

        console.log(clickedElementIndex, label, value)
      }
    }
  }

  setData(fase: number) {
    var that = this;

    var promise = new Promise(function (resolve, reject) {
      that.timeUserPontuacaoBigData[0].data = [];
      //Filtro para tirar elementos empty
      var filtered = that.timeUserPontuacao[fase].filter(function (el) {
        return el != null;
      });

      const values = Object.keys(filtered).map(key => filtered[key]);

      that.timeUserPontuacaoBigData[0].data = values;
      resolve(that.timeUserPontuacaoBigData);
      reject('erro');
    })

    promise.then(function () {

      that.chartTypeLine();
    })

  }

  setDataTimes(fase: number) {
    var that = this;

    var promiseTimes = new Promise(function (resolve, reject) {
      resolve(that.initTimes());
      reject('erro');
    });

    promiseTimes.then(function () {
      that.times.forEach(element => {
        element.forEach((time, index) => {
          var filtered = that.timesPontuacao[fase][index].filter(function (el) {
            return el != null;
          });

          const values = Object.keys(filtered).map(key => filtered[key]);

          that.chartDatas[index] = [
            {
              label: "Pontuação",
              pointBorderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 1,
              pointRadius: 4,
              fill: true,
              borderWidth: 2,
              data: values
            }
          ]

        })
      })
    })

  }

  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }

  findTimeUser() {
    this.times.forEach(element => {
      element.forEach((element, index) => {
        //Encontrando id do time do usuário logado
        this.authService.getUserTimeId().then(function (id) {
          if (element.id == id) {
            this.indexTimeUser = index;
            console.log(index, this.indexTimeUser);
          }
        })
      })
    })
  }

  initSetDataTimes() {
    this.times.forEach(element => {
      element.forEach((time, i) => {

        this.chartDatas[i] = [
          {
            label: "Pontuação",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            borderWidth: 2,
            data: []
          }
        ]
      })
    })
  }

  logout() {
    this.authService.logout();
  }
}
