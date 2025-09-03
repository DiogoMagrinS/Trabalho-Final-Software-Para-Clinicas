import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  listarAgendamentos,
  buscarAgendamentoPorId,
  criarAgendamento,
  atualizarAgendamento,
  excluirAgendamento,
  listarAgendamentosDoUsuario,
  atualizarObservacoes,
  listarHistoricoStatus
} from '../services/agendamentoService';

const prisma = new PrismaClient();

export async function getAgendamentos(req: Request, res: Response) {
  const lista = await listarAgendamentos();
  res.json(lista);
}

export async function getAgendamentoPorId(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const item = await buscarAgendamentoPorId(id);
    res.json(item);
  } catch {
    res.status(404).json({ erro: 'Agendamento não encontrado' });
  }
}

export async function postAgendamento(req: Request, res: Response) {
  try {
    const novo = await criarAgendamento(req.body);
    res.status(201).json(novo);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function putAgendamento(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const atualizado = await atualizarAgendamento(id, req.body);
    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function deleteAgendamento(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    await excluirAgendamento(id);
    res.status(204).send();
  } catch {
    res.status(404).json({ erro: 'Erro ao deletar agendamento' });
  }
}

export async function listarAgendamentosUsuario(req: Request, res: Response) {
  try {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Token inválido ou ausente.' });
    }

    const usuarioId = req.usuario.id;
    const tipo = req.usuario.tipo;

    if (tipo !== 'PACIENTE') {
      return res.status(403).json({ erro: 'Acesso permitido apenas para pacientes.' });
    }

    const agendamentos = await listarAgendamentosDoUsuario(usuarioId);
    res.json(agendamentos);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function editarObservacoes(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { observacoes } = req.body;

    if (typeof observacoes !== 'string' || observacoes.trim() === '') {
      return res.status(400).json({ erro: 'Observações inválidas.' });
    }

    const atualizado = await atualizarObservacoes(id, observacoes);
    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function getHistoricoStatus(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const historico = await listarHistoricoStatus(id);
    res.json(historico);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

// GET /profissionais/:id/disponibilidade?data=2025-08-20
export async function getDisponibilidade(req: Request, res: Response) {
  const profissionalId = parseInt(req.params.id);
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: 'Data é obrigatória' });
  }

  try {
    const profissional = await prisma.profissional.findUnique({
      where: { id: profissionalId },
      include: { usuario: true },
    });

    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado' });
    }

    // Converter data recebida em objeto Date
    const d = new Date(`${data}T00:00:00`);

    // Mapa de números do getDay() → enum DiaSemana
    const diaSemanaMap: Record<number, any> = {
      0: 'DOMINGO',
      1: 'SEGUNDA',
      2: 'TERCA',
      3: 'QUARTA',
      4: 'QUINTA',
      5: 'SEXTA',
      6: 'SABADO',
    };

    const diaSemanaEnum = diaSemanaMap[d.getDay()];

    // Se o profissional não atende nesse dia
    if (!profissional.diasAtendimento.includes(diaSemanaEnum)) {
      return res.json([]); 
    }

    // Gera lista de horários possíveis (30min)
    const horarios: string[] = [];
    let horaAtual = new Date(`${data}T${profissional.horaInicio}`);
    const fim = new Date(`${data}T${profissional.horaFim}`);

    while (horaAtual < fim) {
      horarios.push(horaAtual.toTimeString().slice(0, 5)); // formato HH:MM
      horaAtual.setMinutes(horaAtual.getMinutes() + 30);
    }

    // Buscar agendamentos já existentes nesse dia
    const agendados = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        data: {
          gte: new Date(`${data}T00:00:00`),
          lt: new Date(`${data}T23:59:59`),
        },
        status: { not: 'CANCELADO' },
      },
      select: { data: true },
    });

    const horariosOcupados = agendados.map(a =>
      new Date(a.data).toTimeString().slice(0, 5)
    );

    // Retorna apenas os horários livres
    const horariosDisponiveis = horarios.filter(h => !horariosOcupados.includes(h));

    return res.json(horariosDisponiveis);
  } catch (err) {
    console.error('Erro ao buscar disponibilidade:', err);
    return res.status(500).json({ erro: 'Erro ao buscar disponibilidade' });
  }
}

export async function atualizarStatus(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body; // esperado: 'CONFIRMADO' ou 'CANCELADO'

    if (!['CONFIRMADO', 'CANCELADO'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido.' });
    }

    const atualizado = await prisma.agendamento.update({
      where: { id },
      data: { status },
    });

    res.json(atualizado);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ erro: error.message });
  }
}