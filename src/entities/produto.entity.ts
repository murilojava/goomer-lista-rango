import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Categoria } from "./categoria.entity";
import { Empresa } from "./empresa.entity";
import { HorarioPromocional } from "./horario-promocional.entity";
import { Imagem } from "./imagem.entity";

@Entity({ name: "produto" })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Empresa, { cascade: false })
  @JoinColumn({ name: "empresa_id" })
  empresa: Empresa;

  @OneToOne((type) => Imagem, { cascade: false })
  @JoinColumn({ name: "foto_id" })
  foto: Imagem;

  @ManyToOne((type) => Imagem, { cascade: false })
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria;

  @Column({ type: "varchar" })
  nome: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  preco: number;

  @Column({ type: "boolean", default: false })
  emPromocao: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precoPromocional: number;

  @Column({ type: "text", nullable: true })
  descricaoPromocional: string;

  horariosPromocionais: HorarioPromocional[];
}
