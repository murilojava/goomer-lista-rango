import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Produto } from "./produto.entity";

@Entity({name: "horario_promocional"})
export class HorarioPromocional {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Produto,   { cascade: false })
  @JoinColumn({ name: "produto_id" })
  produto: Produto;

  @Column({type: "smallint",})
  diaSemana: number;

  @Column({ type: "varchar",length:5 })
  inicio: string;

  @Column({ type: "varchar",length:5 })
  fim: string;
}
