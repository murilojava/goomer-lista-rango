import { EntityManager } from "typeorm";
import { Categoria } from "../entities/categoria.entity";
import { DomainError } from "../erros/domain.error";

export class CategoriaService {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  async validar(categoria: Categoria) {
    if (!categoria.nome) {
      throw new DomainError("Nome da categoria é obrigatório.");
    }

    if (!categoria.empresa || !categoria.empresa.id) {
      throw new DomainError("Empresa é obrigatória.");
    }

    const categoriaWhitSameName = await this.encontrarPorNome(categoria.nome);

    if (
      categoriaWhitSameName &&
      (!categoria.id || categoria.id !== categoriaWhitSameName.id)
    ) {
      throw new DomainError("Já existe uma categoria com esse nome.");
    }
  }

  private async encontrarPorNome(nome: string) {
    const result = await this.manager.query(
      `SELECT * FROM categoria WHERE nome = ?`,
      [nome],
    );

    if (result.length === 0) return null;

    const item = result[0];

    return {
      id: item.id,
      nome: item.nome,
      empresa: {
        id: item.empresa_id,
      },
    };
  }

  async criar(categoria: Categoria) {
    await this.validar(categoria);

    const result = await this.manager.query(
      `INSERT INTO categoria (nome, empresa_id) VALUES (?, ?)`,
      [categoria.nome, categoria.empresa.id],
    );
    const categoriaSaved = {
      ...categoria,
      id: result.insertId,
    };
    return categoriaSaved;
  }

  async atualizar(id: number, categoria: Categoria) {
    await this.validar(categoria);

    await this.manager.query(`UPDATE categoria SET nome = ? WHERE id = ?`, [
      categoria.nome,
      id,
    ]);

    return categoria;
  }

  async deletar(id: number) {
    await this.manager.query(`DELETE FROM categoria WHERE id = ?`, [id]);
  }

  async encontrarTodasPorEmpresaId(empresaId: number) {
    // Forma de buscar usando o TYPEORM
    // return await this.repository.find({ where: { empresa: {  id: empresaId, } } });,

    const dbResult = await this.manager.query(
      `select * from categoria where empresa_id = ?`,
      [empresaId],
    );

    const result = dbResult.map((item: any) => {
      return {
        id: item.id,
        nome: item.nome,
        empresa: {
          id: item.empresa_id,
        },
      };
    });

    return result;
  }

  async encontrarPorId(id: number) {
    const dbResult = await this.manager.query(
      `select * from categoria where id = ?`,
      [id],
    );

    if (dbResult.length === 0) return null;

    const item = dbResult[0];

    return {
      id: item.id,
      nome: item.nome,
      empresa: {
        id: item.empresa_id,
      },
    };
  }
}
