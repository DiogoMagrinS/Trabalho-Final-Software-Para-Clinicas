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
  try {
    const especialidade = req.query.especialidade
      ? parseInt(req.query.especialidade as string)
      : undefined;

    const dados = await listarProfissionais(especialidade);
    res.json(dados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar profissionais' });
  }
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
  const { usuarioId, especialidadeId, diasAtendimento, horaInicio, horaFim, biografia, formacao, fotoPerfil } = req.body;

  if (!usuarioId || !especialidadeId || !diasAtendimento || !horaInicio || !horaFim || !biografia || !formacao || !fotoPerfil) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const novo = await criarProfissional(req.body);
    res.status(201).json(novo);
  } catch (error: any) {
    res.status(400).json({ erro: error.message || 'Erro ao criar profissional' });
  }
}

export async function putProfissional(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const atualizado = await atualizarProfissional(id, req.body);
    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message }); // agora mostra o erro real
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