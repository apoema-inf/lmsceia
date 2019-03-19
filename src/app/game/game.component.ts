import { Component, OnInit } from '@angular/core';
import { ContaService } from 'app/services/conta.service';
import { Conta } from 'app/models/conta.model';
import { AuthService } from 'app/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  contas: Conta[];
  itens: any[];
  user: any;
  msg: string = "";
  valor: any;
  time: any;

  constructor(private contaService: ContaService, private authService: AuthService) {
    authService.getAuth().then(user => {
      this.user = user;
      contaService.getUserConta(this.user).toPromise().then(conta => {
        this.contas = conta;
        contaService.getUserTime(this.user).toPromise().then(time => {
          this.time = time[0];
        })
      })
    })
    contaService.getItens().toPromise().then(item => {
      this.itens = item;
    })
  }

  ngOnInit() {
    $("#valor").mask('#.###,00', { reverse: true });
  }

  ifnull(valor): boolean {
    if (valor == null ||
      valor == '' ||
      valor ==  undefined) {
      this.msg = "Sem valor indicado";
      return false;
    } else {
      return true;
    }
  }

  credita() {
    if (this.ifnull(this.valor)) {
      this.msg = "";
      let valor = parseFloat(this.valor.replace(",", "."));
      console.log(valor);
      this.contas[0].saldo = this.contas[0].saldo + valor;
      this.contaService.updateConta(this.contas[0]).subscribe(
        response => {
          console.log(response);
          this.contaService.getUserConta(this.user).toPromise().then(conta => {
            this.contas = conta;
          })
        },
      );
    } else {
      return;
    }

  }

  saque(valor) {
    console.log(valor);
    if (this.ifnull(valor)) {
      if (this.contas[0].saldo < valor) {
        this.msg = "Sem limite para o saldo solicitado: " + this.contas[0].saldo;
        return;
      } else {
        this.msg = "";
        //let valore = parseFloat(valor.replace(",", "."));
        this.contas[0].saldo = this.contas[0].saldo - valor;
        this.contaService.updateConta(this.contas[0]).subscribe(
          response => {
            console.log(response);
            this.contaService.getUserConta(this.user).toPromise().then(conta => {
              this.contas = conta;
            })
          },
        );
      }
    } else {
      return;
    }
  }
}
