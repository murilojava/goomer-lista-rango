import express from "express";
import { getDataSource } from "./database/app-datasource";
import { DomainError } from "./erros/domain.error";
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
    this.handleErrors();
  }

  async initDatabase() {
    console.info("Iniciando conexão com o banco de dados");

    await getDataSource().initialize();

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

  handleErrors() {
    this.app.use((err: any, req: any, res: any, next: any) => {
      if(err){
        console.error(err)
        
        if(err instanceof DomainError) {
          return res.status(400).json({ message: err.message });
        }
        
        return res.status(500).json({ message: "Erro interno" });
      }
      
      res.status(404).json({ message: "Rota não encontrada" });
    });
  }

  start() {
    const port = process.env.PORT || 3000;
    this.app?.listen(port, () => {
      console.info(`Servidor iniciado na porta: ${port}`);
    });
  }

  stop() {
    console.info("Parando servidor");
    this.app.disable("server");
  }
}
