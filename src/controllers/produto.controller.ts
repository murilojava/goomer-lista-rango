import { Request, Response, Router } from "express";
import { getDataSource } from "../database/app-datasource";
import { ProdutoService } from "../services/produto.service";
import { Controller } from "./controller.interface";

export class ProdutoController implements Controller {
  produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService(getDataSource().manager);
  }

  initRoutes(router: Router): void {
    const path = "/produto/:empresaId";
    router.get(`${path}`, this.listarTodos);
    router.post(path, this.criar);
    router.get(`${path}/:produtoId`, this.listarUnico);
    router.patch(`${path}/:produtoId`, this.atualizar);
    router.delete(`${path}/:produtoId`, this.remover);
  }

  listarTodos = async (req: Request, res: Response) => {
    const { empresaId } = req.params;

    const response = await this.produtoService.encontrarTodosPorEmpresaId(
      +empresaId,
    );
    return res.json(response);
  };

  listarUnico = async (req: Request, res: Response) => {
    const { produtoId } = req.params;
    const response = await this.produtoService.encontrarProdutoPorId(
      +produtoId,
    );
    if (!response) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.json(response);
  };

  criar = async (req: Request, res: Response, next: any) => {
    try {
      const produto = {
        ...req.body,
        empresa: { id: +req.params.empresaId },
      };
      const response = await this.produtoService.criar(produto);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  atualizar = async (req: Request, res: Response, next: any) => {
    const { empresaId, produtoId } = req.params;
    try {
      const updateBody = {
        ...req.body,
        empresa: { id: +empresaId },
      };
      const response = await this.produtoService.atualizar(
        +produtoId,
        updateBody,
      );

      return res.json({
        messagem: "Produto atualizado com sucesso!",
        produto: response,
      });
    } catch (e) {
      next(e);
    }
  };

  remover = async (req: Request, res: Response, next: any) => {
    const { produtoId } = req.params;
    try {
      await this.produtoService.deletar(+produtoId);
      return res.json({ messagem: "Produto removido com sucesso!" });
    } catch (e) {
      next(e);
    }
  };
}
