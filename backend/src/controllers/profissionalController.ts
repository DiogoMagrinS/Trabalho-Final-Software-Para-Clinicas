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
  const profissionalId = parseInt(req.params.id);
  const data = (req.query.data as string) || '';

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res.status(400).json({ erro: 'Parâmetro "data" é obrigatório no formato YYYY-MM-DD.' });
  }

  try {
    const profissional = await prisma.profissional.findUnique({
      where: { id: profissionalId }
    });

    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado.' });
    }

    // diasAtendimento é uma String no schema (ex.: "SEGUNDA,TERCA,QUARTA")
    const diasAtendimento = (profissional.diasAtendimento || [])
    .map((s: string) => s.toUpperCase().trim())
    .filter(Boolean);
    // Descobre o dia da semana da data informada
    const d = new Date(`${data}T00:00:00`);
    const day = d.getDay(); // 0=Dom,1=Seg,...,6=Sab
    const mapDia = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
    const diaSemana = mapDia[day];

    // Se o profissional não atende nesse dia, retorna vazio
    if (!diasAtendimento.includes(diaSemana)) {
      return res.json([]);
    }

    // Gera slots de 30min entre horaInicio e horaFim
    const gerarSlots = (inicio: string, fim: string) => {
      const slots: string[] = [];
      const start = new Date(`${data}T${inicio}:00`);
      const end = new Date(`${data}T${fim}:00`);
      let cur = new Date(start);

      while (cur < end) {
        slots.push(cur.toTimeString().slice(0, 5));
        cur.setMinutes(cur.getMinutes() + 30);
      }
      return slots;
    };

    const todosHorarios = gerarSlots(profissional.horaInicio, profissional.horaFim);

    // Busca agendamentos existentes (que NÃO estejam cancelados)
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        status: { not: StatusAgendamento.CANCELADO },
        data: {
          gte: new Date(`${data}T00:00:00`),
          lt: new Date(`${data}T23:59:59`)
        }
      },
      select: { data: true }
    });

    const ocupadosSet = new Set(
      agendamentos.map(a => new Date(a.data).toTimeString().slice(0, 5))
    );

    const livres = todosHorarios.filter(h => !ocupadosSet.has(h));
    return res.json(livres);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: 'Erro ao calcular disponibilidade.' });
  }
}
