import { Router } from 'express';
import {
  getAgendamentos,
  getAgendamentoPorId,
  postAgendamento,
  putAgendamento,
  deleteAgendamento,
  atualizarStatus
} from '../controllers/agendamentoController';
import { listarAgendamentosUsuario } from '../controllers/agendamentoController';
import { getDisponibilidade } from '../controllers/agendamentoController';
import { autenticarToken } from '../middlewares/authMiddleware';
import { listarAgendamentosProfissional } from '../controllers/agendamentoController';

const router = Router();

router.use(autenticarToken);

// ⚠️ coloque /me ANTES de '/:id' para não conflitar
router.get('/me', listarAgendamentosUsuario);
router.patch('/:id/status', autenticarToken, atualizarStatus);
router.get('/disponibilidade/:id', getDisponibilidade);
router.get('/', getAgendamentos);
router.get('/:id', getAgendamentoPorId);
router.post('/', postAgendamento);
router.put('/:id', putAgendamento);
router.delete('/:id', deleteAgendamento);
router.get('/profissional/me', listarAgendamentosProfissional);

export default router;
