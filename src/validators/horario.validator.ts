import { DomainError } from "../erros/domain.error";

const validarIntervaloTempo = (tempo: string) => {
  const minutos = tempo.slice(-2);
  return parseInt(minutos) % 15 === 0;
};

const validar = (horario: any) => {
  const { diaSemana, inicio, fim } = horario;

  if (!diaSemana) {
    throw new DomainError("Dia da semana é obrigatório");
  }

  if (!inicio) {
    throw new DomainError("Horário de início é obrigatório");
  }

  if (!fim) {
    throw new DomainError("Horário de fim é obrigatório");
  }

  const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

  if (!horarioRegex.test(inicio)) {
    throw new DomainError("Horário de início deve estar no formato HH:mm");
  }

  if (!horarioRegex.test(fim)) {
    throw new DomainError("Horário de fim deve estar no formato HH:mm");
  }

  if (!validarIntervaloTempo(inicio)) {
    throw new DomainError(
      "Horário de início deve ser em intervalos de 15 minutos",
    );
  }

  if (!validarIntervaloTempo(fim)) {
    throw new DomainError(
      "Horário de fim deve ser em intervalos de 15 minutos",
    );
  }

  if (inicio >= fim) {
    throw new DomainError(
      "Horário de início deve ser menor que o horário de fim",
    );
  }

  if (diaSemana < 0 || diaSemana > 6) {
    throw new DomainError("Dia da semana deve ser um valor entre 0 e 6");
  }

  return true;
};

export const HorarioValidator = {
  validar,
};
