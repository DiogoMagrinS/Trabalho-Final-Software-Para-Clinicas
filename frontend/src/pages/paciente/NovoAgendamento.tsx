import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getUserFromToken } from '../../utils/getUserFromToken';

interface Especialidade {
  id: number;
  nome: string;
}

interface Profissional {
  id: number;
  usuarioId: number;
  especialidadeId: number;
  diasAtendimento: string[];
  horaInicio: string;
  horaFim: string;
  biografia?: string | null;
  formacao?: string | null;
  fotoPerfil?: string | null;
  usuario: {
    nome: string;
    email: string;
    tipo: string;
  };
}

export default function NovoAgendamento() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalId, setProfissionalId] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [especialidadeId, setEspecialidadeId] = useState('');
  const [data, setData] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [hora, setHora] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  const navigate = useNavigate();

  // 🔹 Carregar especialidades
  useEffect(() => {
    api.get('/especialidades')
      .then((res) => setEspecialidades(res.data))
      .catch((err) => {
        console.error('Erro ao carregar especialidades:', err);
      });
  }, []);

  // 🔹 Carregar profissionais quando mudar especialidade
  useEffect(() => {
    if (especialidadeId) {
      api.get(`/profissionais?especialidade=${especialidadeId}`)
        .then((res) => {
          setProfissionais(res.data);
        })
        .catch((err) => {
          console.error('Erro ao carregar profissionais:', err);
        });

      setProfissionalId('');
      setProfissionalSelecionado(null);
    }
  }, [especialidadeId]);

  // 🔹 Selecionar profissional
  const handleSelecionarProfissional = (id: string) => {
    setProfissionalId(id);
    const profissional = profissionais.find((p) => p.id === Number(id));
    setProfissionalSelecionado(profissional ?? null);
    setHorariosDisponiveis([]);
    setHora('');
  };

  // 🔹 Buscar disponibilidade quando escolher data
  useEffect(() => {
    async function fetchDisponibilidade() {
      if (!profissionalId || !data) return;

      try {
        const res = await api.get(`/profissionais/${profissionalId}/disponibilidade`, {
          params: { data }
        });
        setHorariosDisponiveis(res.data);
        setHora('');
      } catch (err) {
        console.error('Erro ao buscar disponibilidade:', err);
        setHorariosDisponiveis([]);
      }
    }

    fetchDisponibilidade();
  }, [profissionalId, data]);

  // 🔹 Confirmar agendamento
  const handleConfirmarAgendamento = async () => {
    setAgendamentoConfirmado(false);
    setMensagem('');

    if (!profissionalId || !data || !hora) {
      setMensagem('Preencha todos os campos para agendar.');
      return;
    }

    const user = getUserFromToken();

    if (!user?.id) {
      setMensagem('Usuário não autenticado.');
      return;
    }

    const dataHoraISO = new Date(`${data}T${hora}:00`).toISOString();

    try {
      await api.post('/agendamentos', {
        pacienteId: user.id,
        profissionalId: Number(profissionalId),
        data: dataHoraISO,
      });

      setMensagem('Agendamento confirmado com sucesso!');
      setAgendamentoConfirmado(true);

      // resetar campos
      setData('');
      setHora('');
      setProfissionalId('');
      setProfissionalSelecionado(null);
      setEspecialidadeId('');
      setHorariosDisponiveis([]);
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      setMensagem('Erro ao confirmar agendamento. Tente novamente.');
      setAgendamentoConfirmado(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Agendamento</h1>

      {/* Especialidade */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Especialidade</label>
        <select
          className="w-full p-2 border rounded"
          value={especialidadeId}
          onChange={(e) => setEspecialidadeId(e.target.value)}
        >
          <option value="">Selecione...</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Profissional */}
      {profissionais.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Profissional</label>
          <select
            className="w-full p-2 border rounded"
            value={profissionalId}
            onChange={(e) => handleSelecionarProfissional(e.target.value)}
          >
            <option value="">Selecione...</option>
            {profissionais.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.usuario.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Data */}
      {profissionalSelecionado && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Data</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
      )}

      {/* Horários disponíveis */}
      {horariosDisponiveis.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Horário</label>
          <select
            className="w-full p-2 border rounded"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          >
            <option value="">Selecione...</option>
            {horariosDisponiveis.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Botão confirmar */}
      {profissionalSelecionado && (
        <button
          onClick={handleConfirmarAgendamento}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Confirmar Agendamento
        </button>
      )}

      {/* Mensagem */}
      {mensagem && (
        <div className="mt-6 max-w-2xl mx-auto">
          <p className={`text-sm ${agendamentoConfirmado ? 'text-green-600' : 'text-red-600'}`}>
            {mensagem}
          </p>

          {agendamentoConfirmado && (
            <div className="mt-3">
              <button
                onClick={() => navigate('/paciente/agendamentos')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Ver Meus Agendamentos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
