import { PrismaClient, DiaSemana } from '@prisma/client';



const prisma = new PrismaClient();

export async function listarProfissionais() {
  return prisma.profissional.findMany({
    include: {
      usuario: true,
      especialidade: true,
    },
  });
}

export async function buscarProfissionalPorId(id: number) {
  const profissional = await prisma.profissional.findUnique({
    where: { id },
    include: { usuario: true, especialidade: true },
  });
  if (!profissional) throw new Error();
  return profissional;
}

export async function criarProfissional(data: {
  usuarioId: number;
  especialidadeId: number;
  diasAtendimento: DiaSemana[];
  horaInicio: string;
  horaFim: string;
}) {
  return prisma.profissional.create({ data });
}

export async function atualizarProfissional(
  id: number,
  data: Partial<{
    especialidadeId: number;
    diasAtendimento: DiaSemana[];
    horaInicio: string;
    horaFim: string;
  }>
) {
  return prisma.profissional.update({
    where: { id },
    data,
  });
}
export async function excluirProfissional(id: number) {
  return prisma.profissional.delete({ where: { id } });
}

export async function getAgendaProfissional(id: number) {
  return prisma.profissional.findUnique({
    where: { id },
    select: {
      id: true,
      usuario: { select: { nome: true } },
      especialidade: { select: { nome: true } },
      diasAtendimento: true,
      horaInicio: true,
      horaFim: true
    }
  });
}