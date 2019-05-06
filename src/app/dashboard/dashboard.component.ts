import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Membro } from 'app/models/membro.model';
import { FirebaseService } from 'app/services/firebase.service';
import { SetupService } from 'app/services/setup.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AngularFirestore]
})
export class DashboardComponent implements OnInit {

  times: Array<any> = new Array();
  atividades: Array<any> = new Array();
  missoes: Array<any> = new Array();
  user: Membro = new Membro();
  timeOnTheBig: Array<any> = new Array();
  temporadaDestaque: string = "1ª Temporada";
  fases = ["1ª Temporada", "2ª Temporada", "3ª Temporada", "4ª Temporada", "5ª Temporada", "6ª Temporada",
    "7ª Temporada", "8ª Temporada"];
  modal = { title: '', pontuacao: 0, missao: '', descricao: '' };
  atividadesModal = [];
  flag: boolean = false;
  time: string = '';

  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  indexTimeUser: number;

  constructor(private firebaseService: FirebaseService, private authService: AuthService,
    private af: AngularFirestore, private router: Router, private element: ElementRef,
    private setupService: SetupService) {
    
    this.authService.getAuth().then(user => {
      this.user = user as Membro;
      this.setupPage();
    });
  }

  private setupPage() {
    let promises = [];
    promises.push(this.carregarDados());
    promises.push(this.firebaseService.getMissões());
    Promise.all(promises).then(([atividades, missoes]) => {
      this.atividades = atividades;
      this.missoes = missoes;
    });
  }

  private carregarDados(): Promise<any> {
    return new Promise((resolve, reject) => {
      let localAtividades = [];
      if (this.times.length != 0) {
        this.times.forEach((time, index) => {
          this.firebaseService.getAtividadesByTime(time.ref).then(atividades => {
            if (time.id == this.user.time.id) {
              this.indexTimeUser = index;
              this.timeOnTheBig = atividades[index];
            }
            localAtividades.push(atividades);
          });
        });
      } else {
        this.firebaseService.getTimes().then(times => {
          (times as Array<any>).forEach((time, index) => {
            this.times.push({id: time.id, ref: time.ref});
            this.firebaseService.getAtividadesByTime(time.ref).then(atividades => {
              if (time.id == this.user.time.id) {
                this.indexTimeUser = index;
                this.timeOnTheBig = atividades[index];
              }
              localAtividades.push(atividades);
            });
          });
        });
      }
      resolve(localAtividades);
    });
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
  }

  toogleFase(temporada: string) {
    this.atividades = [];
    this.firebaseService.setTemporadaEmDestaque(temporada);
    this.temporadaDestaque = this.firebaseService.getTemporadaEmDestaque();
    this.setupPage();
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

  receberModal(respostaModal) {
    this.modal = respostaModal[0];
    this.atividadesModal = respostaModal[1];
  }

  receberDataset(respostaDataset) {
    this.timeOnTheBig = respostaDataset[0];
    this.flag = true;
    this.time = respostaDataset[1];
  }

  receberVoltarDataset(respostaVoltar) {
    this.flag = respostaVoltar;
    this.timeOnTheBig = this.atividades[this.indexTimeUser];
  }

  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }

  logout() {
    this.authService.logout();
  }
}
