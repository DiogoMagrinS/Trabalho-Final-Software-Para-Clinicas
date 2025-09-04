// src/pages/paciente/NovoAgendamento.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getUserFromToken } from '../../utils/getUserFromToken';
import { AxiosError } from 'axios';

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
  especialidade?: {
    nome: string;
  };
}

export default function NovoAgendamento() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalId, setProfissionalId] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [especialidadeId, setEspecialidadeId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  const navigate = useNavigate();

  // 🔹 Carrega especialidades
  useEffect(() => {
    api.get('/especialidades')
      .then((res) => setEspecialidades(res.data))
      .catch((err) => {
        console.error('Erro ao carregar especialidades:', err);
      });
  }, []);

  // 🔹 Carrega profissionais ao selecionar especialidade
  useEffect(() => {
    if (especialidadeId) {
      api.get(`/profissionais?especialidade=${especialidadeId}`)
        .then((res) => setProfissionais(res.data))
        .catch((err) => {
          console.error('Erro ao carregar profissionais:', err);
        });

      setProfissionalId('');
      setProfissionalSelecionado(null);
    }
  }, [especialidadeId]);

  // 🔹 Seleção de profissional
  const handleSelecionarProfissional = (id: string) => {
    setProfissionalId(id);
    const profissional = profissionais.find((p) => p.id === Number(id));
    setProfissionalSelecionado(profissional ?? null);
    setHorariosDisponiveis([]);
    setHora('');
  };

  // 🔹 Carregar horários disponíveis sempre que profissional + data forem escolhidos
  useEffect(() => {
    if (profissionalId && data) {
      api.get(`/agendamentos/disponibilidade/${profissionalId}?data=${data}`)
        .then((res) => {
          setHorariosDisponiveis(res.data);
        })
        .catch((err) => {
          console.error('Erro ao buscar disponibilidade:', err);
          setHorariosDisponiveis([]);
        });
    }
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

    const dataHoraSelecionada = new Date(`${data}T${hora}:00`);

    // 🔹 Validação no frontend — bloqueia datas/horários passados
    if (dataHoraSelecionada < new Date()) {
      setMensagem('Não é permitido agendar em datas ou horários passados.');
      return;
    }

    const dataHoraISO = dataHoraSelecionada.toISOString();

    try {
      await api.post('/agendamentos', {
        pacienteId: user.id,
        profissionalId: Number(profissionalId),
        data: dataHoraISO,
      });

      setMensagem('Agendamento confirmado com sucesso!');
      setAgendamentoConfirmado(true);

      // Limpar campos após sucesso
      setData('');
      setHora('');
      setProfissionalId('');
      setProfissionalSelecionado(null);
      setEspecialidadeId('');
      setHorariosDisponiveis([]);
    } catch (error) {
      const err = error as AxiosError<{ erro: string }>;
      console.error('Erro ao confirmar agendamento:', err);

      const erroMsg =
        err.response?.data?.erro ??
        'Erro ao confirmar agendamento. Tente novamente.';

      setMensagem(erroMsg);
      setAgendamentoConfirmado(false);
    }
  };

  // 🔹 Data mínima = hoje
  const dataMinima = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Agendamento</h1>

      {/* Seleção de Especialidade */}
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

      {/* Seleção de Profissional */}
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
                {prof.usuario.nome} — {prof.especialidade?.nome ?? ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Informações do Profissional */}
      {profissionalSelecionado && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Informações do Profissional</h2>
          <p><strong>Nome:</strong> {profissionalSelecionado.usuario.nome}</p>
          <p><strong>Email:</strong> {profissionalSelecionado.usuario.email}</p>
          <p><strong>Dias de Atendimento:</strong> {profissionalSelecionado.diasAtendimento.join(', ')}</p>
          <p><strong>Horário:</strong> {profissionalSelecionado.horaInicio} às {profissionalSelecionado.horaFim}</p>

          {/* Formação */}
          {profissionalSelecionado.formacao && (
            <p><strong>Formação:</strong> {profissionalSelecionado.formacao}</p>
          )}

          {/* Biografia */}
          {profissionalSelecionado.biografia && (
            <p><strong>Biografia:</strong> {profissionalSelecionado.biografia}</p>
          )}

          {/* Foto */}
          {profissionalSelecionado.fotoPerfil && (
            <div className="mt-3">
              <img
                src={profissionalSelecionado.fotoPerfil}
                alt={`Foto de ${profissionalSelecionado.usuario.nome}`}
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}

          {/* Seleção de Data */}
          <div className="mt-6">
            <div className="mb-4">
              <label className="block mb-1 font-medium">Data</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={data}
                onChange={(e) => setData(e.target.value)}
                min={dataMinima}
              />
            </div>

            {/* Seleção de Horário (só horários disponíveis) */}
            {data && (
              <div className="mb-4">
                <label className="block mb-1 font-medium">Horário</label>
                <select
                  className="w-full p-2 border rounded"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  disabled={!horariosDisponiveis.length}
                >
                  <option value="">Selecione...</option>
                  {horariosDisponiveis.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {!horariosDisponiveis.length && (
                  <p className="text-sm text-gray-500 mt-1">
                    Nenhum horário disponível para esta data.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleConfirmarAgendamento}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirmar Agendamento
            </button>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso/erro */}
      {mensagem && (
        <div className="mt-6">
          <p className={`text-sm ${agendamentoConfirmado ? 'text-green-600' : 'text-red-600'}`}>
            {mensagem}
          </p>
          {agendamentoConfirmado && (
            <button
              onClick={() => navigate('/paciente/agendamentos')}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Ver Meus Agendamentos
            </button>
          )}
        </div>
      )}
    </div>
  );
}
