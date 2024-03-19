import { Request, Response, Router } from "express";
import * as fs from "fs";
import multer from "multer";
import { extname, join } from "path";
import { getDataSource } from "../database/app-datasource";
import { DomainError } from "../erros/domain.error";
import { ImagemService } from "../services/imagem.service";
import { Controller } from "./controller.interface";

const upload = multer({ dest: "uploads/" });

export class ImagemController implements Controller {
  private imagemService: ImagemService;

  constructor() {
    this.imagemService = new ImagemService(getDataSource().manager);
  }

  initRoutes(router: Router): void {
    router.post("/imagem", upload.single("imagem"), this.gravarImagem);
    router.get("/imagem/:key", this.retornarImagem);
  }

  gravarImagem = async (req: Request, res: Response, next: any) => {
    const file = req.file;
    if (!file) return next(new DomainError("Arquivo não encontrado"));
    
    try {
      const key = file.filename + extname(file.originalname);

      const base64 = fs.readFileSync(file.path, { encoding: "base64" });

      const result = await this.imagemService.criar({
        key,
        data: base64,
      });

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };

  retornarImagem = async (req: Request, res: Response) => {
    const { key } = req.params;
    const filePath = join(process.cwd(), "uploads", `${key}`);

    if (!fs.existsSync(filePath)) {
      const imagem = await this.imagemService.encontrarPorKey(key);
      if (!imagem)
        return res.status(404).json({ message: "Imagem não encontrada." });

      const base64 = imagem.data.toString("utf-8");

      fs.writeFileSync(filePath, base64, { encoding: "base64" });
    }

    res.sendFile(filePath);
  };
}
