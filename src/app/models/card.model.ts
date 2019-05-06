import { Enfase } from "./enfase.model";
import { Formacao } from "./formacao.model";
import { Ciclo } from "./ciclo.model";

export class Card {
    id: string;
    enfase: Enfase;
    formacao: Formacao;
    ciclo: Ciclo;
    nome: string;
    link: string;
}