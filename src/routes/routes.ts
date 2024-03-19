import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
import { EmpresaController } from "../controllers/empresa.controller";
import { HealthController } from "../controllers/health.controller";
import { ImagemController } from "../controllers/imagem.controller";
import { ProdutoController } from "../controllers/produto.controller";

function initRoutes() {
  const routes = Router();

  console.info("Iniciando o Health Controller");
  new HealthController().initRoutes(routes);
  
  console.info("Iniciando o Imagem Controller");
  new ImagemController().initRoutes(routes);

  console.info("Iniciando o Empresa Controller");
  new EmpresaController().initRoutes(routes);
  
  console.info("Iniciando o Categoria Controller");
  new CategoriaController().initRoutes(routes);
  
  console.info("Iniciando o Produto Controller");
  new ProdutoController().initRoutes(routes);

  return routes;
}

export const Routes = {
  initRoutes,
};
