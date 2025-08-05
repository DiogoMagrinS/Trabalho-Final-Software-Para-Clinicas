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

// 🟢 Coloque rotas específicas antes da dinâmica ":id"
router.get('/me', listarAgendamentosUsuario);
router.get('/:id/historico-status', getHistoricoStatus);
router.get('/:id', getAgendamentoPorId);
router.get('/', getAgendamentos);

router.post('/', postAgendamento);
router.put('/:id/observacoes', editarObservacoes);
router.put('/:id', putAgendamento);
router.delete('/:id', deleteAgendamento);

export default router;
