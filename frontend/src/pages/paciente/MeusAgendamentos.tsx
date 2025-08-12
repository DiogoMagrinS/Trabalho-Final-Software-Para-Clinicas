import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Agendamento {
  id: number;
  data: string;
  status: string;
  profissional: {
    usuario: {
      nome: string;
    };
    especialidade: {
      nome: string;
    };
  };
}

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const res = await api.get('/agendamentos/me');
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

  const handleExcluir = async (id: number) => {
    const confirmar = confirm('Tem certeza que deseja cancelar este agendamento?');
    if (!confirmar) return;

    try {
      await api.delete(`/agendamentos/${id}`);
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
      alert('Agendamento cancelado com sucesso.');
    } catch (err) {
      console.error('Erro ao cancelar agendamento:', err);
      alert('Erro ao cancelar. Tente novamente.');
    }
  };

  const iniciarEdicao = (agendamento: Agendamento) => {
    setEditandoId(agendamento.id);
    const dataObj = new Date(agendamento.data);
    setNovaData(dataObj.toISOString().split('T')[0]);
    setNovaHora(dataObj.toTimeString().slice(0, 5));
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovaData('');
    setNovaHora('');
  };

  const salvarAlteracoes = async (id: number) => {
    if (!novaData || !novaHora) {
      alert('Preencha data e hora');
      return;
    }

    const novaDataHora = new Date(`${novaData}T${novaHora}:00`).toISOString();

    try {
      await api.put(`/agendamentos/${id}`, { data: novaDataHora });
      setAgendamentos((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, data: novaDataHora } : a
        )
      );
      alert('Agendamento atualizado com sucesso!');
      cancelarEdicao();
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      alert('Erro ao atualizar agendamento.');
    }
  };

  if (loading) return <p className="p-6">Carregando agendamentos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Agendamentos</h1>

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {agendamentos.map((agendamento) => {
            const dataObj = new Date(agendamento.data);
            const dataFormatada = dataObj.toLocaleDateString();
            const horaFormatada = dataObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <li key={agendamento.id} className="p-4 border rounded shadow bg-white">
                <p><strong>Profissional:</strong> {agendamento.profissional.usuario.nome}</p>
                <p><strong>Especialidade:</strong> {agendamento.profissional.especialidade.nome}</p>
                <p><strong>Status:</strong> {agendamento.status}</p>

                {editandoId === agendamento.id ? (
                  <>
                    <div className="mt-2 flex gap-4">
                      <div>
                        <label className="block text-sm font-medium">Nova data</label>
                        <input
                          type="date"
                          value={novaData}
                          onChange={(e) => setNovaData(e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Novo horário</label>
                        <input
                          type="time"
                          value={novaHora}
                          onChange={(e) => setNovaHora(e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex gap-4">
                      <button
                        onClick={() => salvarAlteracoes(agendamento.id)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Salvar Alterações
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Data:</strong> {dataFormatada}</p>
                    <p><strong>Horário:</strong> {horaFormatada}</p>

                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => handleExcluir(agendamento.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Cancelar Agendamento
                      </button>

                      <button
                        onClick={() => iniciarEdicao(agendamento)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Editar Agendamento
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}