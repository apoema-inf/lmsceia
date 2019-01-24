import { Membro } from "./membro.model";
import { Missao } from "./missao.model";

export class Atividade {
    id: string;
    nome: string;
    membro: Membro;
    missao: Missao;
    tipo: string;
    feedback: string;
    avaliador: string;
    pontuacao: number;
}