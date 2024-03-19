import { Request, Response, Router } from "express";
import { getDataSource } from "../database/app-datasource";
import { EmpresaService } from "../services/empresa.service";
import { Controller } from "./controller.interface";

export class EmpresaController implements Controller {
  empresaService: EmpresaService;

  constructor() {
    this.empresaService = new EmpresaService(getDataSource().manager);
  }

  initRoutes(router: Router): void {
    router.get("/empresa", this.listarTodos);
    router.post("/empresa", this.criar);
    router.get("/empresa/:id", this.listarUnico);
    router.patch("/empresa/:id", this.atualizar);
    router.delete("/empresa/:id", this.remover);
  }

  listarTodos = async (req: Request, res: Response) => {
    const response = await this.empresaService.encontrarTodas();
    return res.json(response);
  };

  listarUnico = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.empresaService.encontrarEmpresaPorId(+id);
    if (!response) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    return res.json(response);
  };

  criar = async (req: Request, res: Response, next: any) => {
    try {
      const response = await this.empresaService.criar(req.body);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  atualizar = async (req: Request, res: Response, next: any) => {
    const { id } = req.params;
    try {
      const response = await this.empresaService.atualizar(+id, req.body);

      return res.json({
        messagem: "Empresa atualizada com sucesso!",
        empresa: response,
      });
    } catch (e) {
      next(e);
    }
  };

  remover = async (req: Request, res: Response, next: any) => {
    const { id } = req.params;
    try {
      await this.empresaService.deletar(+id);
      return res.json({ messagem: "Empresa removida com sucesso!" });
    } catch (e) {
      next(e);
    }
  };
}
