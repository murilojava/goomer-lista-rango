import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categoria } from "../entities/categoria.entity";
import { Empresa } from "../entities/empresa.entity";
import { HorarioFuncionamento } from "../entities/horario-funcionamento.entity";
import { HorarioPromocional } from "../entities/horario-promocional.entity";
import { Imagem } from "../entities/imagem.entity";
import { Produto } from "../entities/produto.entity";

let AppDataSource: DataSource;

function initDataSource() {
  AppDataSource = new DataSource({
    type: "mysql",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNC == "true",
    logging: false,
    entities: [
      Categoria,
      Empresa,
      HorarioFuncionamento,
      HorarioPromocional,
      Imagem,
      Produto,
    ],
    migrations: [],
    subscribers: [],
  });
}

export const getDataSource = () => {
  if (!AppDataSource) {
    initDataSource();
  }
  return AppDataSource;
};