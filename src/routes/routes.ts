import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

function initRoutes() {
  const routes = Router();

  console.info("Iniciando o health controller")
  new HealthController().initRoutes(routes);

  return routes;
}

export const Routes = {
  initRoutes,
};
