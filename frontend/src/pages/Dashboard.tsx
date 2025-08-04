
import { getUserFromToken } from '../utils/getUserFromToken';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const user = getUserFromToken();

  if (!user) {
    return <p className="text-red-500">Usuário não autenticado.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Bem-vindo, {user.email}</p>
      <p className="mb-4">Perfil: <strong>{user.tipoUsuario}</strong></p>

      {user.tipoUsuario === 'PACIENTE' && (
  <div className="space-y-2">
    <p>Você pode visualizar seus agendamentos.</p>
    <Link
      to="/paciente/agendamentos"
      className="inline-block text-blue-600 underline hover:text-blue-800"
    >
      Ver meus agendamentos
    </Link>
    <br />
    <Link
      to="/paciente/novo-agendamento"
      className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-2"
    >
      Agendar nova consulta
    </Link>
  </div>
)}

      {user.tipoUsuario === 'PROFISSIONAL' && <p>Você pode gerenciar sua agenda.</p>}
      {user.tipoUsuario === 'RECEPCIONISTA' && <p>Você pode administrar os agendamentos da clínica.</p>}
    </div>
  );
}
