import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-break-news',
  templateUrl: './break-news.component.html',
  styleUrls: ['./break-news.component.scss']
})
export class BreakNewsComponent implements OnInit {

  trabalhos = [
    {
      nome: "Gerenciamento de Duplicatas usando SGBD Orientado a Grafos: Um Estudo de Caso",
      link: "https://drive.google.com/file/d/1qAL4KSK-X11xyPGzv8gzfNdxw0RlrTTJ/view?usp=sharing"
    },
    {
      nome: `Modelo Preditivo Para Governança De
      Tecnologia Da Informação Na Administração
      Pública Federal`,
      link: "https://drive.google.com/file/d/1GXZXW452l3t4fkr7zt6RdPbBdyGYwtN-/view?usp=sharing"
    },
    {
      nome: "Ciência de Dados Aplicada à Mortalidade Infantil",
      link: "https://drive.google.com/file/d/1xKrpqYonoU4Wu20T7tW0ISSfvxxdXbr3/view?usp=sharing"
    },
    {
      nome: `Categorização Automática de Textos
      Não Supervisionada Aplicada a um Site
      de Notícias`,
      link: "https://drive.google.com/file/d/1ywRcCSHNH10nnI8zzdO9Mpo0odD0JivD/view?usp=sharing"
    },
    {
      nome: `Solução de Business Intelligence Sob a Ótica da Gestão da Informação e do Conhecimento: 
      Com aplicabilidade na Inteligência competitiva e Gestão de Processos.`,
      link: "https://drive.google.com/file/d/1lz1UjzUvwepwKVsvwEpye6EYwf_yWMF5/view?usp=sharing"
    },
    {
      nome: `Sistema de Auto Machine Learning Aplicado à Predição de Desempenho de Ações
      para o Mercado de Valores`,
      link: "https://drive.google.com/file/d/1bWeBVUlGATRNJr03rfg9cC9DhsWjNJC2/view?usp=sharing"
    },
    {
      nome: `Fatores Habilitadores para a
      Modelagem de Aplicação de Pontuação
      de Crédito para Empresa de Factoring
      de Pequeno Porte`,
      link: "https://drive.google.com/file/d/13eG94yMXHfIXjE2vFPxPtd1C_1TtfcDq/view?usp=sharing"
    },
    {
      nome: "Acidentes de Trânsito nas Rodovias Federais Goianias: Fatores e Causas Relacionadas",
      link: "https://drive.google.com/file/d/1eDH_uUu7An-0u1qLa4Z29CQCeswjbkZj/view?usp=sharing"
    },
    {
      nome: "Business Intelligence e Data Mining para Suporte à Decisão na Mundo Fisio",
      link: "https://drive.google.com/file/d/1eXqKILUjRRP34pkntmXziNTf1wzxErxg/view?usp=sharing"
    }
  ]

  constructor() { }

  ngOnInit() {

  }

}
