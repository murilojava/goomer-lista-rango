import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Empresa } from "./empresa.entity";

@Entity({name: "categoria"})
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Empresa,   { cascade: false })
  @JoinColumn({ name: "empresa_id" })
  empresa: Empresa;

  @Column({type: "varchar",})
  nome: string;
}
