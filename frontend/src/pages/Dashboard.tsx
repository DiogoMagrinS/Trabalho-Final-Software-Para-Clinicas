import { useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/getUserFromToken';
import type { DecodedToken } from '../utils/getUserFromToken';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const decoded = getUserFromToken();
    console.log('TOKEN DECODIFICADO:', decoded);
    setUser(decoded);
  }, []);

  if (!user) return <p className="p-8 text-gray-500">Carregando dados do usuário...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Bem-vindo, <strong>{user.email}</strong></p>
      <p className="mb-4">Perfil: <strong>{user.tipo}</strong></p>

      {user.tipo === 'PACIENTE' && (
        <div className="space-y-2">
          <p>Você pode visualizar seus agendamentos.</p>
          <Link
            to="/paciente/agendamentos"
            className="inline-block text-blue-600 underline hover:text-blue-800"
          >
            Ver meus agendamentos
          </Link>
          <Link to="/paciente/novo-agendamento" className="text-green-600 underline block">
            Agendar nova consulta
          </Link>
        </div>
      )}

      {user.tipo === 'PROFISSIONAL' && (
        <p className="text-green-600">Você pode gerenciar sua agenda.</p>
      )}

      {user.tipo === 'RECEPCIONISTA' && (
        <p className="text-purple-600">Você pode administrar os agendamentos da clínica.</p>
      )}
    </div>
  );
}
