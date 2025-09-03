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

import { autenticarToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(autenticarToken);

// ⚠️ coloque /me ANTES de '/:id' para não conflitar
router.get('/me', listarAgendamentosUsuario);
router.patch('/:id/status', autenticarToken, atualizarStatus);

router.get('/', getAgendamentos);
router.get('/:id', getAgendamentoPorId);
router.post('/', postAgendamento);
router.put('/:id', putAgendamento);
router.delete('/:id', deleteAgendamento);

export default router;
