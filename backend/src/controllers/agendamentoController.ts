import { Request, Response } from 'express';
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


