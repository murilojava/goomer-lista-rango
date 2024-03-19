import { Request, Response, Router } from "express";
import { getDataSource } from "../database/app-datasource";
import { CategoriaService } from "../services/categoria.service";
import { Controller } from "./controller.interface";

export class CategoriaController implements Controller {
  categoriaService: CategoriaService;

  constructor() {
    this.categoriaService = new CategoriaService(getDataSource().manager);
  }

  initRoutes(router: Router): void {
    router.get("/categoria/:empresaId", this.listar);
    router.post("/categoria/:empresaId", this.criar);
    router.get("/categoria/:empresaId/:categoriaId", this.listarUnico);
    router.patch("/categoria/:empresaId/:categoriaId", this.atualizar);
    router.delete("/categoria/:empresaId/:categoriaId", this.remover);
  }

  listar = async (req: Request, res: Response) => {
    const empresaId = Number(req.params.empresaId);

    const categorias = await this.categoriaService.encontrarTodasPorEmpresaId(
      empresaId,
    );

    return res.json(categorias);
  };

  listarUnico = async (req: Request, res: Response, next: any) => {
    const { categoriaId } = req.params;

    const categoria = await this.categoriaService.encontrarPorId(+categoriaId);

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    return res.json(categoria);
  };

  criar = async (req: Request, res: Response, next: any) => {
    const empresaId = Number(req.params.empresaId);

    const body = req.body;

    const categoria = {
      ...body,
      empresa: { id: empresaId },
    };
    try {
      const response = await this.categoriaService.criar(categoria);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  atualizar = async (req: Request, res: Response, next: any) => {
    const { empresaId, categoriaId } = req.params;

    const categoria = {
      ...req.body,
      empresa: { id: +empresaId },
    };
    try {
      const categoriaAtualizada = await this.categoriaService.atualizar(+categoriaId, categoria);

      return res.json({ messagem: "Categoria atualizada com sucesso!", categoria: categoriaAtualizada });
    } catch (e) {
      next(e);
    }
  };

  remover = async (req: Request, res: Response, next: any) => {
    const categoriaId = Number(req.params.categoriaId);

    try {
      await this.categoriaService.deletar(categoriaId);

      return res.json({ messagem: "Categoria removida com sucesso!" });
    } catch (e) {
      next(e);
    }
  };
}
