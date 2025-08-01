import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listarAgendamentos() {
  return prisma.agendamento.findMany({
    include: {
      paciente: true,
      profissional: {
        include: {
          usuario: true,
          especialidade: true
        }
      }
    }
  });
}

export async function buscarAgendamentoPorId(id: number) {
  const agendamento = await prisma.agendamento.findUnique({
    where: { id },
    include: {
      paciente: true,
      profissional: {
        include: { usuario: true, especialidade: true }
      }
    }
  });
  if (!agendamento) throw new Error();
  return agendamento;
}

export async function criarAgendamento(data: {
  pacienteId: number;
  profissionalId: number;
  data: Date;
  observacoes?: string;
}) {
  const profissional = await prisma.profissional.findUnique({
    where: { id: data.profissionalId }
  });

  if (!profissional) throw new Error('Profissional inválido');

  const dataAgendamento = new Date(data.data);

  if (dataAgendamento <= new Date()) {
    throw new Error('Data deve ser futura');
  }

  const conflito = await prisma.agendamento.findFirst({
    where: {
      profissionalId: data.profissionalId,
      data: dataAgendamento
    }
  });

  if (conflito) throw new Error('Horário já agendado');

  return prisma.agendamento.create({
    data: {
      pacienteId: data.pacienteId,
      profissionalId: data.profissionalId,
      data: dataAgendamento,
      observacoes: data.observacoes
    }
  });
}

export async function atualizarAgendamento(
  id: number,
  dados: Partial<{
    pacienteId: number;
    profissionalId: number;
    data: Date;
    status: string;
  }>
) {
  const agendamentoExistente = await prisma.agendamento.findUnique({ where: { id } });
  if (!agendamentoExistente) throw new Error('Agendamento não encontrado');

  const dataAtualizada = dados.data ? new Date(dados.data) : undefined;

  if (dataAtualizada && dataAtualizada <= new Date()) {
    throw new Error('A data do agendamento deve estar no futuro');
  }

  if (dados.profissionalId && dataAtualizada) {
    const conflito = await prisma.agendamento.findFirst({
      where: {
        profissionalId: dados.profissionalId,
        data: dataAtualizada,
        NOT: { id: id }
      }
    });

    if (conflito) {
      throw new Error('Este horário já está ocupado para o profissional');
    }
  }

  return prisma.agendamento.update({
    where: { id },
    data: {
      pacienteId: dados.pacienteId,
      profissionalId: dados.profissionalId,
      data: dataAtualizada,
      status: dados.status as any
    }
  });
}

export async function excluirAgendamento(id: number) {
  return prisma.agendamento.delete({
    where: { id }
  });
}

export async function listarAgendamentosDoUsuario(usuarioId: number) {
  return prisma.agendamento.findMany({
    where: { pacienteId: usuarioId },
    orderBy: { data: 'asc' },
    include: {
      profissional: {
        include: {
          usuario: {
            select: { nome: true }
          },
          especialidade: {
            select: { nome: true }
          }
        }
      }
    }
  });
}

export async function atualizarObservacoes(id: number, observacoes: string) {
  const agendamento = await prisma.agendamento.findUnique({ where: { id } });
  if (!agendamento) throw new Error('Agendamento não encontrado');

  return prisma.agendamento.update({
    where: { id },
    data: { observacoes }
  });
}
