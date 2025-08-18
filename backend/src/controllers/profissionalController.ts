import { Request, Response } from 'express';
import {
  listarProfissionais,
  buscarProfissionalPorId,
  criarProfissional,
  atualizarProfissional,
  excluirProfissional
} from '../services/profissionalService';
import { PrismaClient, StatusAgendamento } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProfissionais(req: Request, res: Response) {
  const dados = await listarProfissionais();
  res.json(dados);
}

export async function getProfissionalPorId(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const profissional = await buscarProfissionalPorId(id);
    res.json(profissional);
  } catch {
    res.status(404).json({ erro: 'Profissional não encontrado' });
  }
}

export async function postProfissional(req: Request, res: Response) {
  try {
    const novo = await criarProfissional(req.body);
    res.status(201).json(novo);
  } catch {
    res.status(400).json({ erro: 'Erro ao criar profissional' });
  }
}

export async function putProfissional(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const atualizado = await atualizarProfissional(id, req.body);
    res.json(atualizado);
  } catch {
    res.status(404).json({ erro: 'Erro ao atualizar profissional' });
  }
}

export async function deleteProfissional(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    await excluirProfissional(id);
    res.status(204).send();
  } catch {
    res.status(404).json({ erro: 'Erro ao excluir profissional' });
  }
}

/**
 * GET /api/profissionais/:id/disponibilidade?data=YYYY-MM-DD
 * Retorna: string[] com horários HH:MM disponíveis em intervalos de 30min
 */
export async function getDisponibilidade(req: Request, res: Response) {
  try {
    const profissionalId = parseInt(req.params.id);
    const data = req.query.data as string;

    if (!data) {
      return res.status(400).json({ erro: 'Data é obrigatória (YYYY-MM-DD).' });
    }

    const profissional = await prisma.profissional.findUnique({
      where: { id: profissionalId },
    });

    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado.' });
    }

    // gerar lista de horários
    const horaInicio = parseInt(profissional.horaInicio.split(':')[0]);
    const horaFim = parseInt(profissional.horaFim.split(':')[0]);
    const horarios: string[] = [];

    for (let h = horaInicio; h < horaFim; h++) {
      horarios.push(`${String(h).padStart(2, '0')}:00`);
    }

    // buscar agendamentos existentes para a data
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        data: {
          gte: new Date(`${data}T00:00:00.000Z`),
          lt: new Date(`${data}T23:59:59.999Z`),
        },
      },
    });

    const horariosOcupados = agendamentos.map(a =>
      new Date(a.data).toISOString().substring(11, 16)
    );

    // retornar apenas horários livres
    const horariosDisponiveis = horarios.filter(h => !horariosOcupados.includes(h));

    res.json(horariosDisponiveis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar disponibilidade.' });
  }
}