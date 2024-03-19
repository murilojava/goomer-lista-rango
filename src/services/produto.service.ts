import { EntityManager } from "typeorm";
import { Produto } from "../entities/produto.entity";
import { DomainError } from "../erros/domain.error";
import { HorarioValidator } from "../validators/horario.validator";

export class ProdutoService {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  async validar(produto: Produto) {
    if (!produto.nome) {
      throw new DomainError("Nome da categoria é obrigatório.");
    }

    if (!produto.preco) {
      throw new DomainError("Preço é obrigatório.");
    }

    if (!produto.empresa || !produto.empresa.id) {
      throw new DomainError("Empresa é obrigatória.");
    }

    if (!produto.categoria || !produto.categoria.id) {
      throw new DomainError("Categoria é obrigatória.");
    }

    if (!produto.foto || !produto.foto.id) {
      throw new DomainError("Foto é obrigatória.");
    }

    if (produto.emPromocao) {
      if (!produto.precoPromocional) {
        throw new DomainError("Preço promocional é obrigatório.");
      }

      if (!produto.descricaoPromocional) {
        throw new DomainError("Preço promocional é obrigatório.");
      }

      if (!produto.horariosPromocionais) {
        throw new DomainError("Horários promocionais são obrigatórios.");
      }

      if (produto.horariosPromocionais) {
        for (const horario of produto.horariosPromocionais)
          HorarioValidator.validar(horario);
      }
    }

    const produtoComOMesmoNome = await this.encontrarPorNome(produto.nome);

    if (
      produtoComOMesmoNome &&
      (!produto.id || produto.id !== produtoComOMesmoNome.id)
    ) {
      throw new DomainError("Já existe um produto com esse nome.");
    }
  }

  private async encontrarPorNome(nome: string) {
    const dbResult = await this.manager.query(
      `SELECT * FROM produto WHERE nome = ?`,
      [nome],
    );
    if (dbResult.length === 0) return null;

    const [item] = dbResult;
    return {
      id: item.id,
      nome: item.nome,
    };
  }

  async criar(produto: Produto) {
    await this.validar(produto);

    const result = await this.manager.query(
      `INSERT INTO produto (nome, preco, empresa_id, categoria_id, foto_id, emPromocao, precoPromocional, descricaoPromocional) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        produto.nome,
        produto.preco,
        produto.empresa.id,
        produto.categoria.id,
        produto.foto.id,
        produto.emPromocao,
        produto.precoPromocional || null,
        produto.descricaoPromocional || null,
      ],
    );

    const empresaSaved = {
      ...produto,
      id: result.insertId,
    };

    await this.inserirHorariosPromocionais(
      empresaSaved.id,
      produto.horariosPromocionais,
    );

    return empresaSaved;
  }

  private async inserirHorariosPromocionais(produtoId: number, horarios: any) {
    for (const horario of horarios) {
      const result = await this.manager.query(
        `INSERT INTO horario_promocional (diaSemana, inicio, fim, produto_id) VALUES (?, ?, ?, ?)`,
        [horario.diaSemana, horario.inicio, horario.fim, produtoId],
      );

      horario.id = result.insertId;
    }
  }

  async atualizar(id: number, produto: Produto) {
    await this.validar(produto);

    await this.manager.query(
      `UPDATE produto SET nome = ?, preco = ?, empresa_id = ?, categoria_id = ?, foto_id = ?, emPromocao = ?, precoPromocional = ?, descricaoPromocional = ? WHERE id = ?`,
      [
        produto.nome,
        produto.preco,
        produto.empresa.id,
        produto.categoria.id,
        produto.foto.id,
        produto.emPromocao,
        produto.precoPromocional || null,
        produto.descricaoPromocional || null,
        id,
      ],
    );

    await this.manager.query(
      `DELETE FROM horario_promocional WHERE produto_id = ?`,
      [id],
    );

    await this.inserirHorariosPromocionais(id, produto.horariosPromocionais);

    return produto;
  }

  async deletar(id: number) {
    await this.manager.query(
      `DELETE FROM horario_promocional WHERE produto_id = ?`,
      [id],
    );
    await this.manager.query(`DELETE FROM produto WHERE id = ?`, [id]);
  }

  async encontrarTodosPorEmpresaId(empresaId: number) {
    const dbResult = await this.manager.query(
      `select p.*, f.id as foto_id, f.key as foto_key, c.id as categoria_id, c.nome as categoria_nome from produto as p
      left join imagem as f on p.foto_id = f.id
      left join categoria as c on p.categoria_id = c.id
      where p.empresa_id = ?`,
      [empresaId],
    );

    const result = dbResult.map((item: any) =>
      this.transformarRowParaProduto(item),
    );

    return result;
  }

  private transformarRowParaProduto(row: any) {
    const foto = {
      id: row.foto_id,
      key: row.foto_key,
    };

    const categoria = {
      id: row.categoria_id,
      nome: row.categoria_nome,
    };

    return {
      id: row.id,
      nome: row.nome,
      preco: row.preco,
      emPromocao: row.emPromocao,
      precoPromocional: row.precoPromocional,
      descricaoPromocional: row.descricaoPromocional,
      foto,
      categoria,
    };
  }

  async encontrarProdutoPorId(id: number) {
    const result = await this.manager.query(
      `select p.*, f.id as foto_id, f.key as foto_key, c.id as categoria_id, c.nome as categoria_nome 
      from produto as p
      left join imagem as f on p.foto_id = f.id
      left join categoria as c on p.categoria_id = c.id
      where p.id = ?`,
      [id],
    );

    if (result.length === 0) return null;

    const [item] = result;

    const produto: any = this.transformarRowParaProduto(item);

    produto.horariosPromocionais = await this.encontrarHorariosPromocionais(id);

    return produto;
  }

  async encontrarHorariosPromocionais(id: number) {
    const result = await this.manager.query(
      `SELECT * FROM horario_promocional WHERE produto_id = ?`,
      [id],
    );

    return result.map((item: any) => {
      return {
        id: item.id,
        diaSemana: item.dia_semana,
        inicio: item.inicio,
        fim: item.fim,
      };
    });
  }
}
