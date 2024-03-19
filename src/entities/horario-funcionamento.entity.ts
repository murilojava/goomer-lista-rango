import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Empresa } from "./empresa.entity";

@Entity({name: "horario_funcionamento"})
export class HorarioFuncionamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Empresa,   { cascade: false })
  @JoinColumn({ name: "empresa_id" })
  empresa: Empresa;

  @Column({type: "smallint",})
  diaSemana: number;

  @Column({ type: "varchar",length:5 })
  inicio: string;

  @Column({ type: "varchar",length:5 })
  fim: string;
}
