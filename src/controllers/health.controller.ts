import { Request, Response, Router } from "express";
import { AppDataSource } from "../database/app-datasource";
import { Controller } from "./controller.interface";

export class HealthController implements Controller {
  initRoutes(router: Router): void {
    router.get("/health", this.index);
  }

  async index(req: Request, res: Response) {
    const dbOk = AppDataSource.isInitialized;

    return res.json({ message: "Servidor está rodando.", dbOk });
  }
}
