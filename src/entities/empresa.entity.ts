import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { HorarioFuncionamento } from "./horario-funcionamento.entity";
import { Imagem } from "./imagem.entity";

@Entity({name: "empresa"})
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Imagem, { cascade: false })
  @JoinColumn({ name: "foto_id" })
  foto: Imagem;

  @Column({type: "varchar",})
  nome: string;

  @Column({type: "varchar", nullable: true })
  rua: string;

  @Column({ type: "varchar",nullable: true, length: 10 })
  numero: string;

  @Column({type: "varchar", nullable: true })
  bairro: string;

  @Column({ type: "varchar",nullable: true })
  cidade: string;

  horariosFuncionamento: HorarioFuncionamento[];  
}
