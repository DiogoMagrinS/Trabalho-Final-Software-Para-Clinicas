import { Router } from 'express';
import {
  getProfissionais,
  getProfissionalPorId,
  postProfissional,
  putProfissional,
  deleteProfissional
} from '../controllers/profissionalController';
import { autenticarToken } from '../middlewares/authMiddleware';
import { agendaProfissional } from '../controllers/profissionalController';

const router = Router();

router.use(autenticarToken); // Protege as rotas

router.get('/', getProfissionais);
router.get('/:id', getProfissionalPorId);
router.post('/', postProfissional);
router.put('/:id', putProfissional);
router.delete('/:id', deleteProfissional);
router.get('/:id/agenda', agendaProfissional);

export default router;
