import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {

  onda: String = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.onda = '';
      this.onda = params.onda + 'ª Onda';
    });
  }

}
