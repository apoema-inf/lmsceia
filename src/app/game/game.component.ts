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

  inventario = { quantidade: 1, time_id: '', item_id: '' };
  extrato = { date: new Date(), tipo: '', valor: 0.0, usuario_id: 0, conta_id: 1 };
  contas: Conta[];
  itens: any[];
  user: any;
  msg: string = "";
  valor: number;
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
  }

  ifnull(valor): boolean {
    if (valor == null ||
      valor == '' ||
      valor == undefined) {
      this.msg = "Sem valor indicado";
      return false;
    } else {
      return true;
    }
  }

  credita() {
    if (this.ifnull(this.valor)) {
      this.msg = "";
      this.contas[0].saldo = this.contas[0].saldo + this.valor;
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

  saque(valor, itemID) {
    console.log(valor);
    this.inventario.item_id = itemID;
    this.inventario.time_id = this.time.id_time;
    this.extrato.date = new Date();
    this.extrato.tipo = 'S';
    this.extrato.valor = parseFloat(valor);
    this.extrato.usuario_id = 1;
    this.extrato.conta_id = this.contas[0].id_conta;
    if (this.ifnull(valor)) {
      if (this.contas[0].saldo < valor) {
        this.msg = "Sem limite para o saldo solicitado: " + this.contas[0].saldo;
        return;
      } else {
        this.msg = "";
        this.contas[0].saldo = this.contas[0].saldo - valor;
        this.contaService.setInventario(this.inventario).toPromise().then(value => {
          this.contaService.updateConta(this.contas[0]).subscribe(
            response => {
              this.contaService.setExtrato(this.extrato).toPromise().then(res => {
                this.contaService.getUserConta(this.user).toPromise().then(conta => {
                  this.contas = conta;
                })
              })
            },
          );
        })
      }
    } else {
      return;
    }
  }
}
