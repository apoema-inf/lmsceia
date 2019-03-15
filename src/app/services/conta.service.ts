import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { Conta } from 'app/models/conta.model';
import { Time } from '@angular/common';

@Injectable()
export class ContaService {

  constructor(private http: Http) { }

  private serverApi = 'http://localhost:3000';

  public getUserConta(user): Observable<Conta[]> {
    let timeId = user.time.id;
    let URI = `${this.serverApi}/conta/${timeId}`;
    return this.http.get(URI)
      .map(res => res.json())
      .map(res => <Conta[]>res);
  }

  public getUserTime(user): Observable<Time[]> {
    let timeId = user.time.id;
    let URI = `${this.serverApi}/time/${timeId}`;
    return this.http.get(URI)
      .map(res => res.json())
      .map(res => <Time[]>res);
  }

  public deleteConta(contaId: number) {
    let URI = `${this.serverApi}/conta/${contaId}`;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.delete(URI, { headers })
      .map(res => console.log(res));
  }

  public updateConta(conta: Conta) {
    let URI = `${this.serverApi}/conta/${conta.id_conta}`;
    let headers = new Headers;
    let body = JSON.stringify(conta);
    headers.append('Content-Type', 'application/json');
    return this.http.put(URI, body, { headers: headers })
      .map(res => res);
  }

}
