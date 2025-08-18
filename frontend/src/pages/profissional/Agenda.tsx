// frontend/src/pages/profissional/Agenda.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getUserFromToken } from '../../utils/getUserFromToken';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';

interface Agendamento {
  id: number;
  data: string; // ISO
  paciente: {
    usuario: {
      nome: string;
      email: string;
    };
  };
  profissional: {
    usuario: {
      nome: string;
      email: string;
    };
    especialidade: {
      nome: string;
    };
  };
}

export default function AgendaProfissional() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      setErro('Usuário não autenticado.');
      setLoading(false);
      return;
    }

    if (user.tipo !== 'PROFISSIONAL') {
      setErro('Acesso permitido apenas para profissionais.');
      setLoading(false);
      return;
    }

    async function fetchAgenda() {
      try {
        const res = await api.get('/agendamentos/minha-agenda');
        setAgendamentos(res.data);
      } catch (err) {
        const axiosErr = err as AxiosError<{ erro: string }>;
        const msg = axiosErr.response?.data?.erro ?? 'Erro ao carregar agenda.';
        setErro(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchAgenda();
  }, []);

  if (loading) return <p className="p-6">Carregando agenda...</p>;

  if (erro) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-600">{erro}</p>
        {erro.includes('Perfil de profissional não encontrado') && (
          <p className="text-sm">
            Vá ao menu de cadastro e complete seu perfil de profissional.
          </p>
        )}
        <Link to="/dashboard" className="text-blue-600 underline">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Minha Agenda</h1>

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {agendamentos.map((a) => {
            const dt = new Date(a.data);
            return (
              <li key={a.id} className="p-4 border rounded bg-white shadow">
                <p>
                  <strong>Data:</strong> {dt.toLocaleDateString()}
                </p>
                <p>
                  <strong>Hora:</strong>{' '}
                  {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p>
                  <strong>Paciente:</strong> {a.paciente.usuario.nome} ({a.paciente.usuario.email})
                </p>
                <p>
                  <strong>Especialidade:</strong> {a.profissional.especialidade?.nome}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
