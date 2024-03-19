import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "imagem" })
export class Imagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  key: string;

  @Column({ type: "blob", nullable: true })
  data: string;
}
