import { Router } from 'express';
import {
  getAgendamentos,
  getAgendamentoPorId,
  postAgendamento,
  putAgendamento,
  deleteAgendamento,
  listarAgendamentosUsuario,
} from '../controllers/agendamentoController';
import { autenticarToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(autenticarToken);

// ⚠️ /me PRECISA vir antes de '/:id'
router.get('/me', listarAgendamentosUsuario);

router.get('/', getAgendamentos);
router.get('/:id', getAgendamentoPorId);
router.post('/', postAgendamento);
router.put('/:id', putAgendamento);
router.delete('/:id', deleteAgendamento);

export default router;
