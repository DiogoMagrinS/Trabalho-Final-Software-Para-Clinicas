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
    onClose: () => void;
  }
  
  export default function PacienteModal({ agendamento, onClose }: Props) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Dados do Paciente</h2>
          <p><strong>Nome:</strong> {agendamento.paciente.nome}</p>
          <p><strong>Email:</strong> {agendamento.paciente.email}</p>
          <p><strong>Horário:</strong> {agendamento.hora}</p>
          <p><strong>Status:</strong> {agendamento.status}</p>
  
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }
  