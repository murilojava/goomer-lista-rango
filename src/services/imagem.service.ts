import { EntityManager } from "typeorm";

import { Imagem } from "../entities/imagem.entity";
import { DomainError } from "../erros/domain.error";

export class ImagemService {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  async validar(categoria: Imagem) {
    if (!categoria.key) {
      throw new DomainError("A chave da imagem é obrigatória.");
    }
  }

  async criar(imagem: Imagem) {
    await this.validar(imagem);

    const result = await this.manager.query(
      `INSERT INTO imagem (key, data) VALUES (?, ?)`,
      [imagem.key, imagem.data],
    );

    const saved = {
      ...imagem,
      id: result.insertId,
    };
    return saved;
  }

  async deletar(id: number) {
    await this.manager.query(`DELETE FROM imagem WHERE id = ?`, [id]);
  }

  async encontrarPorKey(key: string) {
    const result = await this.manager.query(
      `SELECT * FROM imagem WHERE key = ?`,
      [key],
    );

    if (result.length === 0) return null;

    const item = result[0];

    return {
      id: item.id,
      key: item.key,
      data: item.data,
    };
  }
}
