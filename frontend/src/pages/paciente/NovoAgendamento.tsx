// src/pages/paciente/NovoAgendamento.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Especialidade {
  id: number;
  nome: string;
}

interface Profissional {
  id: number;
  nome: string;
}

export default function NovoAgendamento() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  const [especialidadeId, setEspecialidadeId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/especialidades')
      .then((res) => setEspecialidades(res.data))
      .catch((err) => console.error('Erro ao carregar especialidades', err));
  }, []);

  useEffect(() => {
    if (especialidadeId) {
      api.get(`/profissionais?especialidadeId=${especialidadeId}`)
        .then((res) => setProfissionais(res.data))
        .catch((err) => console.error('Erro ao carregar profissionais', err));
    } else {
      setProfissionais([]);
    }
  }, [especialidadeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/agendamentos', {
        profissionalId: Number(profissionalId),
        data,
        horario,
      });

      alert('Consulta agendada com sucesso!');
      navigate('/paciente/agendamentos');
    } catch (err) {
      alert('Erro ao agendar consulta.');
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agendar Nova Consulta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Especialidade</label>
          <select
            value={especialidadeId}
            onChange={(e) => setEspecialidadeId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecione...</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>{esp.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Profissional</label>
          <select
            value={profissionalId}
            onChange={(e) => setProfissionalId(e.target.value)}
            className="w-full border p-2 rounded"
            required
            disabled={!especialidadeId}
          >
            <option value="">Selecione...</option>
            {profissionais.map((prof) => (
              <option key={prof.id} value={prof.id}>{prof.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Horário</label>
          <input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Agendar
        </button>
      </form>
    </div>
  );
}
