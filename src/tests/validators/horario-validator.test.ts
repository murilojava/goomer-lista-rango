// FILEPATH: /Users/murilojava/Dev/desafios/goomer/tests/horario.validator.test.ts
import { describe, expect, it } from "vitest";
import { HorarioValidator } from "../../validators/horario.validator";
const validar = HorarioValidator.validar;

describe("Horario Validator", () => {
  it("should throw an error if diaSemana is missing", () => {
    expect(() => validar({ inicio: "08:00", fim: "18:00" })).toThrow(
      "Dia da semana é obrigatório",
    );
  });

  it("should throw an error if inicio is missing", () => {
    expect(() => validar({ diaSemana: 1, fim: "18:00" })).toThrow(
      "Horário de início é obrigatório",
    );
  });

  it("should throw an error if fim is missing", () => {
    expect(() => validar({ diaSemana: 1, inicio: "08:00" })).toThrow(
      "Horário de fim é obrigatório",
    );
  });

  it("should throw an error if inicio is not in 15 interval", () => {
    expect(() =>
      validar({ diaSemana: 1, inicio: "08:03", fim: "10:00" }),
    ).toThrow("Horário de início deve ser em intervalos de 15 minutos");
  });

  it("should throw an error if fim is not in 15 interval", () => {
    expect(() =>
      validar({ diaSemana: 1, inicio: "08:00", fim: "15:12" }),
    ).toThrow("Horário de fim deve ser em intervalos de 15 minutos");
  });

  it("should throw an error if inicio is greater than or equal to fim", () => {
    expect(() =>
      validar({ diaSemana: 1, inicio: "18:00", fim: "08:00" }),
    ).toThrow("Horário de início deve ser menor que o horário de fim");
  });

  it("should throw an error if diaSemana is less than 0 or greater than 6", () => {
    expect(() =>
      validar({ diaSemana: -1, inicio: "08:00", fim: "18:00" }),
    ).toThrow("Dia da semana deve ser um valor entre 0 e 6");
    expect(() =>
      validar({ diaSemana: 7, inicio: "08:00", fim: "18:00" }),
    ).toThrow("Dia da semana deve ser um valor entre 0 e 6");
  });

  it("should throw an error if inicio is not in the format HH:mm", () => {
    expect(() =>
      validar({ diaSemana: 1, inicio: "8:00", fim: "18:00" }),
    ).toThrow("Horário de início deve estar no formato HH:mm");
  });

  it("should throw an error if fim is not in the format HH:mm", () => {
    expect(() =>
      validar({ diaSemana: 1, inicio: "08:00", fim: "18:0" }),
    ).toThrow("Horário de fim deve estar no formato HH:mm");
  });

  it("should return true if all inputs are valid", () => {
    expect(validar({ diaSemana: 1, inicio: "08:00", fim: "18:00" })).toBe(true);
  });
});
