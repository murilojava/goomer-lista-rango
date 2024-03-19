import express from "express";
import { AppDataSource } from "./database/app-datasource";
import { Routes } from "./routes/routes";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
  }

  async init() {
    await this.initDatabase();
    this.initMiddlewares();
    this.initRoutes();
  }

  async initDatabase() {
    console.info("Iniciando conexão com o banco de dados");

    await AppDataSource.initialize();

    console.info("Banco de dados iniciado com sucesso");
  }

  initMiddlewares() {
    console.info("Iniciando middlewares");

    this.app.use(express.json());

    console.info("Middlewares iniciados com sucesso");
  }

  initRoutes() {
    console.info("Iniciando rotas");

    this.app.use(Routes.initRoutes());

    console.info("Rotas iniciadas com sucesso");
  }

  start() {
    const port = process.env.PORT || 3000;
    this.app?.listen(port, () => {
      console.info(`Servidor iniciado na porta: ${port}`);
    });
  }
}
