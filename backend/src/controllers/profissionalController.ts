import { Request, Response } from 'express';
import {
  listarProfissionais,
  buscarProfissionalPorId,
  criarProfissional,
  atualizarProfissional,
  excluirProfissional
} from '../services/profissionalService';
import { getAgendaProfissional } from '../services/profissionalService';

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
    res.status(404).json({ erro: 'Erro ao remover profissional' });
  }
}

export async function agendaProfissional(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const agenda = await getAgendaProfissional(id);

    if (!agenda) {
      return res.status(404).json({ erro: 'Profissional não encontrado.' });
    }

    res.json(agenda);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}