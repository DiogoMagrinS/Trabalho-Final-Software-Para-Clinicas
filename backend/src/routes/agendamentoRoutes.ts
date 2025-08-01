import { Router } from 'express';
import {
  getAgendamentos,
  getAgendamentoPorId,
  postAgendamento,
  putAgendamento,
  deleteAgendamento,
  listarAgendamentosUsuario,
  editarObservacoes,
  getHistoricoStatus
} from '../controllers/agendamentoController';

import { autenticarToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(autenticarToken);

router.get('/', getAgendamentos);
router.get('/:id', getAgendamentoPorId);
router.get('/me', listarAgendamentosUsuario);
router.get('/:id/historico-status', getHistoricoStatus);

router.post('/', postAgendamento);
router.put('/:id', putAgendamento);
router.put('/:id/observacoes', editarObservacoes);
router.delete('/:id', deleteAgendamento);


export default router;
