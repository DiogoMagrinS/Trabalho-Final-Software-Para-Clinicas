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
  const [hora, setHora] = useState('');
  const [mensagem, setMensagem] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/especialidades').then((res) => setEspecialidades(res.data));
  }, []);

  useEffect(() => {
    if (especialidadeId) {
      api
        .get(`/profissionais?especialidade=${especialidadeId}`)
        .then((res) => {
          setProfissionais(res.data);
        });

      setProfissionalId('');
      setProfissionalSelecionado(null);
    }
  }, [especialidadeId]);

  const handleSelecionarProfissional = (id: string) => {
    setProfissionalId(id);
    const profissional = profissionais.find((p) => p.id === Number(id));
    setProfissionalSelecionado(profissional ?? null);
  };

  const handleConfirmarAgendamento = async () => {
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
      setData('');
      setHora('');
      setProfissionalId('');
      setProfissionalSelecionado(null);
      setEspecialidadeId('');
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      setMensagem('Erro ao confirmar agendamento. Tente novamente.');
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

      {/* Informações do profissional */}
      {profissionalSelecionado && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Informações do Profissional</h2>
          <p><strong>Nome:</strong> {profissionalSelecionado.usuario.nome}</p>
          <p><strong>Email:</strong> {profissionalSelecionado.usuario.email}</p>
          <p><strong>Dias de Atendimento:</strong> {profissionalSelecionado.diasAtendimento.join(', ')}</p>
          <p><strong>Horário:</strong> {profissionalSelecionado.horaInicio} às {profissionalSelecionado.horaFim}</p>
          {profissionalSelecionado.formacao && (
            <p><strong>Formação:</strong> {profissionalSelecionado.formacao}</p>
          )}
          {profissionalSelecionado.biografia && (
            <p><strong>Biografia:</strong> {profissionalSelecionado.biografia}</p>
          )}
          {profissionalSelecionado.fotoPerfil && (
            <div className="mt-3">
              <img
                src={profissionalSelecionado.fotoPerfil}
                alt="Foto do profissional"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}

          {/* Data e hora */}
          <div className="mt-6">
            <div className="mb-4">
              <label className="block mb-1 font-medium">Data</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Horário</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>

            <button
              onClick={handleConfirmarAgendamento}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirmar Agendamento
            </button>

            {mensagem && (
              <div className="mt-4">
                <p className="text-sm text-green-600">{mensagem}</p>

                {mensagem === 'Agendamento confirmado com sucesso!' && (
                  <button
                    onClick={() => navigate('/paciente/agendamentos')}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Ver Meus Agendamentos
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
