interface Agendamento {
    id: number;
    hora: string;
    status: string;
    paciente: {
      nome: string;
      email: string;
    };
  }
  
  interface Props {
    agendamento: Agendamento;
    onAtualizarStatus: (id: number, status: string) => void;
    onVerPaciente: () => void;
  }
  
  export default function AgendamentoCard({ agendamento, onAtualizarStatus, onVerPaciente }: Props) {
    return (
      <div className="p-4 border rounded shadow flex justify-between items-center">
        <div>
          <p><strong>Paciente:</strong> {agendamento.paciente.nome}</p>
          <p><strong>Horário:</strong> {agendamento.hora}</p>
          <p><strong>Status:</strong> {agendamento.status}</p>
        </div>
        <div className="flex gap-2">
          {agendamento.status !== "CONFIRMADO" && (
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => onAtualizarStatus(agendamento.id, "CONFIRMADO")}
            >
              Confirmar
            </button>
          )}
          {agendamento.status !== "CANCELADO" && (
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => onAtualizarStatus(agendamento.id, "CANCELADO")}
            >
              Cancelar
            </button>
          )}
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={onVerPaciente}
          >
            Detalhes
          </button>
        </div>
      </div>
    );
  }
  