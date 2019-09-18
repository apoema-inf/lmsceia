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
  lideres2: Array<any> = new Array();
  lideres3: Array<any> = new Array();

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
    this.lideres2.push({nome: 'Albino oreira dos Santos', time: 'Time #01', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-01%2FAlbino%20Moreira%20dos%20Santos%20-%20Albino.jpeg?alt=media&token=3e0eeaac-81fa-415f-a9e3-edc85e057e14'});
    this.lideres2.push({nome: 'Edem Pereira de Oliveira', time: 'Time #02', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-02%2FEdem%20-%20Superbrother.jpeg?alt=media&token=a1a0a9f5-422a-47e9-a3f6-4cf0aa371d5b'});
    this.lideres2.push({nome: 'Saádilla Carvalho Silva', time: 'Time #03', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-03%2Fsaadila.jpeg?alt=media&token=909bce7c-204b-4ff3-898b-cef07866082b'});
    this.lideres2.push({nome: 'Lauriana Alves Moreira', time: 'Time #04', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-04%2FLaur%C3%ADssima.jpeg?alt=media&token=0e4b9772-4ce1-45bf-8764-6914fb597284'});
    this.lideres2.push({nome: 'Vanessa Mota', time: 'Time #05', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-05%2FVanessa%20Mota%20-%20Nani.jpeg?alt=media&token=f0b91597-ab19-4ad8-b72a-6eee47c55b8a'});
    this.lideres2.push({nome: 'Heitor Batista De Oliveira', time: 'Time #06', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-06%2FHeitor%20Oliveira.jpeg?alt=media&token=7331a1f4-ac82-4f71-b08f-105c2615f3d7'});
    this.lideres2.push({nome: 'Alysson Martins Bruno', time: 'Time #07', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-07%2FCrazyman.jpeg?alt=media&token=3409736c-be02-41da-b26f-c62591744cbe'});
    this.lideres2.push({nome: 'Ricardo Tavares da Silva', time: 'Time #09', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-09%2FAvatar%20-%20Rick%20-%20Ricardo%20Tavares.jpeg?alt=media&token=86c56929-f557-4f0a-b361-08f6f8e5e6d1'});
    this.lideres2.push({nome: 'Leila Aparecida Santos Motta Cunha', time: 'Time #10', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-10%2FLeila-MARVEL.jpeg?alt=media&token=66431862-88b9-4c63-a566-4e5e81602cc2'});
    this.lideres2.push({nome: 'Daniel Chaffe Stone', time: 'Time #11', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-12%2FDaniel%20ser%C3%A1%20Petram%20(rocha).jpeg?alt=media&token=d5695154-21dc-4f7b-b8a9-da260441eb75'});
    
    this.lideres3.push({nome: 'Gilmar Antônio Xavier Filho', time: 'Time #01', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2F13_Missing_File_document_lost_computer-512.png?alt=media&token=8e74d1b7-fcd0-43b0-8587-750a80727a4b'});
    this.lideres3.push({nome: 'João Paulo Oliveira Louceiro', time: 'Time #02', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-02%2FAvatar-Jo%C3%A3o%20Paulo_Jploucerio.jpeg?alt=media&token=a4327a5e-2826-404a-bfe5-20b536f0b0a0'});
    this.lideres3.push({nome: 'Fabio Oliveira Guimarães', time: 'Time #03', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-03%2FFOG.jpeg?alt=media&token=242c985b-4cc0-4591-b290-f34c8084b49a'});
    this.lideres3.push({nome: 'Ygor Galvão Lourenço', time: 'Time #04', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2F13_Missing_File_document_lost_computer-512.png?alt=media&token=8e74d1b7-fcd0-43b0-8587-750a80727a4b'});
    this.lideres3.push({nome: 'Michael Douglas Vieira Neiva', time: 'Time #05', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2F13_Missing_File_document_lost_computer-512.png?alt=media&token=8e74d1b7-fcd0-43b0-8587-750a80727a4b'});
    this.lideres3.push({nome: 'Luciana Dutra Martins', time: 'Time #06', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-06%2FLuciana%20Dutra.jpeg?alt=media&token=3483c067-59d4-46a3-b5fa-baad4a88667d'});
    this.lideres3.push({nome: 'Clairton Thomazi', time: 'Time #07', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-07%2FClairtim.jpeg?alt=media&token=45a0b310-f25c-4e71-b6ec-f82a8b6dd027'});
    this.lideres3.push({nome: 'Glleddson Fryttys Menezes Leite', time: 'Time #09', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-09%2FAvatar%20-%20Glleddson.jpg?alt=media&token=5e8f089f-41df-4bf0-ad94-2924b264a257'});
    this.lideres3.push({nome: 'Manoel Renan Oliveira Júnior', time: 'Time #10', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2F13_Missing_File_document_lost_computer-512.png?alt=media&token=8e74d1b7-fcd0-43b0-8587-750a80727a4b'});
    this.lideres3.push({nome: 'Joelson Coelho Costa', time: 'Time #11', img: 'https://firebasestorage.googleapis.com/v0/b/posgrad.appspot.com/o/jogadores%2Ftime-11%2FJoelson.png?alt=media&token=0384f227-6198-4eaa-accc-452c0d1235ee'});
    
  
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
