import { EntityManager } from "typeorm";
import { Empresa } from "../entities/empresa.entity";
import { DomainError } from "../erros/domain.error";
import { HorarioValidator } from "../validators/horario.validator";

export class EmpresaService {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  async validar(empresa: Empresa) {
    if (!empresa.nome) {
      throw new DomainError("Nome da categoria é obrigatório.");
    }

    if (!empresa.rua) {
      throw new DomainError("Rua é obrigatória.");
    }

    if (!empresa.numero) {
      throw new DomainError("Número é obrigatório.");
    }

    if (!empresa.bairro) {
      throw new DomainError("Bairro é obrigatório.");
    }

    if (!empresa.cidade) {
      throw new DomainError("Cidade é obrigatória.");
    }

    if (!empresa.foto || !empresa.foto.id) {
      throw new DomainError("Foto é obrigatória.");
    }

    for (const horario of empresa.horariosFuncionamento)
      HorarioValidator.validar(horario);

    const empresaComMesmoNome = await this.encontrarPorNome(empresa.nome);

    if (
      empresaComMesmoNome &&
      (!empresa.id || empresa.id !== empresaComMesmoNome.id)
    ) {
      throw new DomainError("Já existe uma empresa com esse nome.");
    }
  }

  async encontrarPorNome(nome: string) {
    const dbResult = await this.manager.query(
      `SELECT * FROM empresa WHERE nome = ?`,
      [nome],
    );
    if (dbResult.length === 0) return null;

    const item = dbResult[0];
    return {
      id: item.id,
      nome: item.nome,
      rua: item.rua,
      numero: item.numero,
      bairro: item.bairro,
      cidade: item.cidade,
      horariosFuncionamento: [],
    };
  }

  async criar(empresa: Empresa) {
    await this.validar(empresa);

    const result = await this.manager.query(
      `INSERT INTO empresa (nome, rua, numero, bairro, cidade, foto_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        empresa.nome,
        empresa.rua,
        empresa.numero,
        empresa.bairro,
        empresa.cidade,
        empresa.foto.id,
      ],
    );

    const empresaSaved = {
      ...empresa,
      id: result.insertId,
    };

    await this.inserirHorariosFuncionamento(
      empresaSaved.id,
      empresa.horariosFuncionamento,
    );

    return empresaSaved;
  }

  async inserirHorariosFuncionamento(
    empresaId: number,
    horariosFuncionamento: any,
  ) {
    for (const horario of horariosFuncionamento) {
      const result = await this.manager.query(
        `INSERT INTO horario_funcionamento (dia_semana, inicio, fim, empresa_id) VALUES (?, ?, ?, ?)`,
        [horario.diaSemana, horario.inicio, horario.fim, empresaId],
      );

      horario.id = result.insertId;
    }
  }

  async atualizar(id: number, empresa: Empresa) {
    await this.validar(empresa);

    await this.manager.query(
      `UPDATE empresa SET nome = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, foto_id = ? WHERE id = ?`,
      [
        empresa.nome,
        empresa.rua,
        empresa.numero,
        empresa.bairro,
        empresa.cidade,
        empresa.foto.id,
        id,
      ],
    );

    await this.manager.query(
      `DELETE FROM horario_funcionamento WHERE empresa_id = ?`,
      [id],
    );

    await this.inserirHorariosFuncionamento(id, empresa.horariosFuncionamento);

    return empresa;
  }

  async deletar(id: number) {
    await this.manager.query(
      `DELETE horario_promocional
    FROM horario_promocional
    INNER JOIN produto ON produto.id = horario_promocional.produto_id
    WHERE produto.empresa_id = ?`,
      [id],
    );
    await this.manager.query(`DELETE FROM produto WHERE empresa_id = ?`, [id]);
    await this.manager.query(`DELETE FROM categoria WHERE empresa_id = ?`, [
      id,
    ]);
    await this.manager.query(
      `DELETE FROM horario_funcionamento WHERE empresa_id = ?`,
      [id],
    );
    await this.manager.query(`DELETE FROM empresa WHERE id = ?`, [id]);
  }

  async encontrarTodas() {
    const dbResult = await this.manager.query(
      `select e.*, f.id as foto_id, f.key as foto_key from empresa as e
      left join foto as f on e.foto_id = f.id`,
    );

    const result = dbResult.map((item: any) => {
      const foto = {
        id: item.foto_id,
        key: item.foto_key,
      };

      return {
        id: item.id,
        nome: item.nome,
        rua: item.rua,
        numero: item.numero,
        bairro: item.bairro,
        cidade: item.cidade,
        foto,
      };
    });

    return result;
  }

  async encontrarEmpresaPorId(id: number) {
    const result = await this.manager.query(
      `select e.*, f.id as foto_id, f.key as foto_key from empresa as e
      left join foto as f on e.foto_id = f.id
      where e.id = ?`,
      [id],
    );

    if (result.length === 0) return null;

    const [item] = result;

    const foto = {
      id: item.foto_id,
      key: item.foto_key,
    };

    const restaurante: any = {
      id: item.id,
      nome: item.nome,
      rua: item.rua,
      numero: item.numero,
      bairro: item.bairro,
      cidade: item.cidade,
      foto,
    };

    restaurante.horariosFuncionamento =
      await this.encontrarHorariosFuncionamentoPorEmpresaId(id);

    return restaurante;
  }

  async encontrarHorariosFuncionamentoPorEmpresaId(id: number) {
    const result = await this.manager.query(
      `SELECT * FROM horario_funcionamento WHERE empresa_id = ?`,
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
