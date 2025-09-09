import { useEffect, useState } from "react";
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import AgendamentoCard from "./components/AgendamentoCard";
import PacienteModal from "./components/PacienteModal";

interface Agendamento {
  id: number;
  data: string;
  hora: string;
  status: string;
  paciente: {
    nome: string;
    email: string;
  };
}

export default function Agenda() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Agendamento | null>(null);

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        setLoading(true);
        const res = await api.get(`/agendamentos/profissional/me?data=${dataSelecionada}`);
        setAgendamentos(res.data);
      } catch (err) {
        console.error("Erro ao carregar agendamentos", err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      carregarAgendamentos();
    }
  }, [user, dataSelecionada]);

  async function carregarAgendamentos() {
    try {
      setLoading(true);
      const res = await api.get(`/agendamentos/profissional/me?data=${dataSelecionada}`);
      setAgendamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos", err);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: number, status: string) {
    try {
      await api.put(`/agendamentos/${id}/status`, { status });
      carregarAgendamentos();
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Minha Agenda</h1>

      <input
        type="date"
        value={dataSelecionada}
        onChange={(e) => setDataSelecionada(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : agendamentos.length === 0 ? (
        <p>Nenhum agendamento para esta data.</p>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((a) => (
            <AgendamentoCard
              key={a.id}
              agendamento={a}
              onAtualizarStatus={atualizarStatus}
              onVerPaciente={() => setPacienteSelecionado(a)}
            />
          ))}
        </div>
      )}

      {pacienteSelecionado && (
        <PacienteModal
          agendamento={pacienteSelecionado}
          onClose={() => setPacienteSelecionado(null)}
        />
      )}
    </div>
  );
}
