import * as dotenv from "dotenv";
import fs from "fs";
import { join } from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { App } from "../../app";
import { getDataSource } from "../../database/app-datasource";

let savedKey = "";
let imagemTestId = 0;
let empresaTestId = 0;
let categoriaTestId = 0;
let produtoTestId = 0;

const empresa = {
  id: 0,
  nome: "Restaurante Teste",
  rua: "Rua Teste",
  numero: "123",
  bairro: "Bairro Teste",
  cidade: "Cidade Teste",
  foto: {
    id: 1,
  },
  horariosFuncionamento: [
    {
      diaSemana: 1,
      inicio: "08:00",
      fim: "18:00",
    },
  ],
};

dotenv.config({ path: [".env.test"] });

const app = new App();

const testURL = `http://localhost:${process.env.PORT || 3000}`;

beforeAll(async () => {
  await app.init();

  await getDataSource().manager.query(`DELETE FROM horario_funcionamento`);
  await getDataSource().manager.query(`DELETE FROM horario_promocional`);
  await getDataSource().manager.query(`DELETE FROM produto`);
  await getDataSource().manager.query(`DELETE FROM categoria`);
  await getDataSource().manager.query(`DELETE FROM empresa`);
  await getDataSource().manager.query(`DELETE FROM imagem`);

  app.start();
});

afterAll(async () => {
  app.stop();
});

describe("Routes", () => {
  describe("/imagem", () => {
    it("should create a new imagem", async () => {
      const path = join(__dirname, "test-image.png");
      const formData = new FormData();
      const blob = fs.readFileSync(path);

      formData.append(
        "imagem",
        new Blob([blob], { type: "application/octet-stream" }),
        "test-image.png",
      );

      const response = await fetch(`${testURL}/imagem`, {
        method: "POST",
        body: formData,
      });

      expect(response.status).toBe(200);

      const data = await response.json();

      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("key");
      imagemTestId = data.id;
      savedKey = data.key;
    });

    it("should get an existing imagem", async () => {
      const response = await fetch(`${testURL}/imagem/${savedKey}`);
      expect(response.status).toBe(200);
      const blob = await response.blob();
      const path = join(__dirname, "test-image.png");
      const originalFile = fs.readFileSync(path);
      expect(blob.size).toEqual(originalFile.length);
    });
  });

  describe("/empresa", () => {
    it("should create a new empresa", async () => {
      empresa.foto.id = imagemTestId;

      const response = await fetch(`${testURL}/empresa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
      });
      expect(response.status).toBe(200);

      const responseData = await response.json();
      empresaTestId = responseData.id;

      empresa.id = responseData.id;
    });

    it("should update an existing empresa", async () => {
      empresa.nome = "Empresa Teste 2";

      const response = await fetch(`${testURL}/empresa/${empresaTestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
      });
      expect(response.status).toBe(200);
      const responseData = await response.json();

      empresa.horariosFuncionamento =
        responseData.empresa.horariosFuncionamento;
    });

    it("should return all empresas", async () => {
      const response = await fetch(`${testURL}/empresa`);
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toHaveLength(1);
    });

    it("should return a specific empresa by ID", async () => {
      const response = await fetch(`${testURL}/empresa/${empresaTestId}`);
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.nome).toEqual(empresa.nome);
      expect(responseBody.rua).toEqual(empresa.rua);
      expect(responseBody.numero).toEqual(empresa.numero);
      expect(responseBody.bairro).toEqual(empresa.bairro);
      expect(responseBody.cidade).toEqual(empresa.cidade);
      expect(responseBody.foto.id).toEqual(empresa.foto.id);
      expect(responseBody.horariosFuncionamento).toEqual(
        empresa.horariosFuncionamento,
      );
    });

    it("should return 400 when trying to create a empresa without nome", async () => {
      const empresaWithoutNome = {
        rua: "Rua Teste",
        numero: "123",
        bairro: "Bairro Teste",
        cidade: "Cidade Teste",
        foto: {
          id: 1,
        },
        horariosFuncionamento: [
          {
            diaSemana: 1,
            inicio: "08:00",
            fim: "18:00",
          },
        ],
      };

      const response = await fetch(`${testURL}/empresa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaWithoutNome),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("/categoria", () => {
    it("should create a new categoria", async () => {
      const categoria = {
        nome: "Nova Categoria",
      };

      const response = await fetch(`${testURL}/categoria/${empresaTestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toHaveProperty("id");
      expect(responseData.nome).toEqual(categoria.nome);

      categoriaTestId = responseData.id;
    });

    it("should throw a 400 to categoria without nome", async () => {
      const categoria = {
        nome: "", // categoria sem nome
      };

      const response = await fetch(`${testURL}/categoria/${empresaTestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      expect(response.status).toBe(400);
    });

    it("should return all categorias", async () => {
      const response = await fetch(`${testURL}/categoria/${empresaTestId}`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });

    it("should return a specific categoria by ID", async () => {
      const response = await fetch(
        `${testURL}/categoria/${empresaTestId}/${categoriaTestId}`,
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("id");
      expect(responseBody).toHaveProperty("nome");
    });

    it("should update an existing categoria", async () => {
      const updatedCategoria = {
        nome: "Categoria Atualizada",
      };

      const response = await fetch(
        `${testURL}/categoria/${empresaTestId}/${categoriaTestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategoria),
        },
      );

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.categoria.nome).toEqual(updatedCategoria.nome);
    });
  });

  describe("/produto", () => {
    it("should create a new produto", async () => {
      expect(categoriaTestId).toBeGreaterThan(0);

      const produto = {
        nome: "Produto Teste",
        preco: 10.6,
        emPromocao: false,
        precoPromocional: 0.0,
        descricaoPromocional: "",
        categoria: {
          id: categoriaTestId,
        },
        foto: {
          id: imagemTestId,
        },
        horariosPromocionais: [
          {
            diaSemana: 1,
            inicio: "08:00",
            fim: "18:00",
          },
        ],
      };

      const response = await fetch(`${testURL}/produto/${empresaTestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toHaveProperty("id");
      expect(responseData.nome).toEqual(produto.nome);

      produtoTestId = responseData.id;
    });

    it("should return all produtos", async () => {
      const response = await fetch(`${testURL}/produto/${empresaTestId}`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });

    it("should return a specific produto by ID", async () => {
      expect(produtoTestId).toBeGreaterThan(0);

      const response = await fetch(
        `${testURL}/produto/${empresaTestId}/${produtoTestId}`,
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("id");
      expect(responseBody).toHaveProperty("nome");

      expect(responseBody.nome).toEqual("Produto Teste");
    });

    it("should update an existing produto", async () => {
      expect(produtoTestId).toBeGreaterThan(0);
      const updatedProduto = {
        nome: "Produto Atualizado",
        preco: 22.6,
        emPromocao: true,
        precoPromocional: 10,
        descricaoPromocional: "Teste de desricao",
        categoria: {
          id: categoriaTestId,
        },
        foto: {
          id: imagemTestId,
        },
        horariosPromocionais: [
          {
            diaSemana: 1,
            inicio: "08:00",
            fim: "18:00",
          },
          {
            diaSemana: 2,
            inicio: "08:00",
            fim: "18:00",
          },
        ],
      };

      const response = await fetch(
        `${testURL}/produto/${empresaTestId}/${produtoTestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduto),
        },
      );

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.produto.nome).toEqual(updatedProduto.nome);
    });
  });

  describe("/deletes", () => {
    it("should delete an existing produto", async () => {
      const response = await fetch(
        `${testURL}/produto/${empresaTestId}/${produtoTestId}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(200);
    });

    it("should delete an existing categoria", async () => {
      const response = await fetch(
        `${testURL}/categoria/${empresaTestId}/${categoriaTestId}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(200);
    });

    it("should delete an existing empresa", async () => {
      const response = await fetch(`${testURL}/empresa/${empresaTestId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);
    });
  });
});
