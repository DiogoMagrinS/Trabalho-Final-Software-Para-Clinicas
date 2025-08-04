// src/pages/paciente/MeusAgendamentos.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Agendamento {
  id: number;
  data: string;
  horario: string;
  status: string;
  profissional: {
    nome: string;
    especialidade: string;
  };
}

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const res = await api.get('/agendamentos/meus'); // ajuste se necessário
        setAgendamentos(res.data);
      } catch (err) {
        alert('Erro ao carregar agendamentos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgendamentos();
  }, []);

  if (loading) return <p>Carregando agendamentos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Agendamentos</h1>
      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {agendamentos.map((agendamento) => (
            <li key={agendamento.id} className="p-4 border rounded shadow">
              <p><strong>Data:</strong> {agendamento.data}</p>
              <p><strong>Horário:</strong> {agendamento.horario}</p>
              <p><strong>Profissional:</strong> {agendamento.profissional.nome}</p>
              <p><strong>Especialidade:</strong> {agendamento.profissional.especialidade}</p>
              <p><strong>Status:</strong> {agendamento.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
