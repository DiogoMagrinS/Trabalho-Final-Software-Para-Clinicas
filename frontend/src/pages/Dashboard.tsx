import { useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/getUserFromToken';
import type { DecodedToken } from '../utils/getUserFromToken';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const decoded = getUserFromToken();
    setUser(decoded);
  }, []);

  if (!user) return <p className="p-8 text-gray-500">Carregando dados do usuário...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">
        Bem-vindo, <strong>{user.email}</strong>
      </p>
      <p className="mb-4">
        Perfil: <strong>{user.tipo}</strong>
      </p>

      {user.tipo === 'PACIENTE' && (
        <div className="space-y-2">
          <p>Você pode visualizar seus agendamentos.</p>
          <Link
            to="/paciente/agendamentos"
            className="inline-block text-blue-600 underline hover:text-blue-800"
          >
            Ver meus agendamentos
          </Link>
          <Link
            to="/paciente/novo-agendamento"
            className="text-green-600 underline block"
          >
            Agendar nova consulta
          </Link>
        </div>
      )}

      {user.tipo === 'PROFISSIONAL' && (
        <div className="space-y-2">
          <p>Você pode gerenciar sua agenda.</p>
          <Link
            to="/profissional/agenda"
            className="inline-block text-purple-600 underline hover:text-purple-800"
          >
            Acessar minha agenda
          </Link>
        </div>
      )}

      {user.tipo === 'RECEPCIONISTA' && (
        <div className="space-y-2">
          <p>Você pode administrar os agendamentos da clínica.</p>
          <Link
            to="/recepcionista/gerenciar"
            className="inline-block text-pink-600 underline hover:text-pink-800"
          >
            Gerenciar agendamentos
          </Link>
        </div>
      )}
    </div>
  );
}