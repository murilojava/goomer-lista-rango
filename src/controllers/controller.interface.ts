import { Router } from "express";

export interface Controller {
  initRoutes(router: Router): void;
}
