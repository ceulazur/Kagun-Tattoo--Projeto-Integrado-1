import { message } from "antd";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { agendarSessao, listarSessoes } from "../api/entities/sessao";
import DiaView from "../components/agenda/DiaView";
import MesView from "../components/agenda/MesView";
import NovoAgendamentoModal from "../components/agenda/modals/NovoAgendamentoModal";
import SemanaView from "../components/agenda/SemanaView";

const mockAppointments = [
  {
    idSessao: 1,
    nomeCliente: "Alice",
    data: new Date("2025-01-26T10:00:00"),
    horario: new Date("2025-01-26T11:00:00"),
    status: "agendada",
    termino: new Date("2025-01-26T13:00:00"),
    tatuador: {
      idTatuador: 1,
      nome: "Tatuador 1",
    },
  },
  {
    idSessao: 2,
    nomeCliente: "Bob",
    data: new Date("2025-01-26T12:00:00"),
    horario: new Date("2025-01-26T13:00:00"),
    status: "concluída",
    termino: new Date("2025-01-26T16:30:00"),
    tatuador: {
      idTatuador: 2,
      nome: "Tatuador 2",
    },
  },

  {
    idSessao: 3,
    nomeCliente: "Jonh",
    data: new Date("2025-01-27T12:00:00"),
    horario: new Date("2025-01-27T08:00:00"),
    status: "concluída",
    termino: new Date("2025-01-27T09:30:00"),
    tatuador: {
      idTatuador: 2,
      nome: "Tatuador 2",
    },
  },
];
const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(() => {
    return localStorage.getItem("agendaView") || "month";
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  const handleGetAgendamentos = async () => {
    try {
      const response = await listarSessoes(); // Aguarda a resposta da função listarSessoes
      console.log("Agendamentos carregados com sucesso:", response.sessoes);

      // Transforma as sessões para incluir o campo 'termino' com o mesmo valor de 'horario'
      const appointmentsWithTermino = response.sessoes.map((sessao) => ({
        ...sessao,
        termino: sessao.horario, // 'termino' recebe o mesmo valor de 'horario'
      }));

      console.log(
        "Agendamentos com termino carregados com sucesso:",
        appointmentsWithTermino
      );

      setAppointments(appointmentsWithTermino); // Atualiza o estado com os agendamentos transformados
    } catch (error) {
      message.error("Erro ao carregar os agendamentos. Tente novamente."); // Exibe mensagem de erro em caso de falha
    }
  };

  useEffect(() => {
    localStorage.setItem("agendaView", view);
    handleGetAgendamentos();
  }, [view]);

  const handleDateChange = (operation) => {
    const operationMap = {
      prev: {
        day: subDays,
        week: subWeeks,
        month: subMonths,
      },
      next: {
        day: addDays,
        week: addWeeks,
        month: addMonths,
      },
    };
    const selectedOperation = operationMap[operation][view];
    setCurrentDate(selectedOperation(currentDate, 1));
  };

  const handleSaveAgendamento = async (novoAgendamento) => {
    try {
      const response = await agendarSessao(novoAgendamento);
      console.log("response", response);
      if (response.status == 201) {
        message.success("Agendamento salvo com sucesso!");
      }
      handleGetAgendamentos();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error.response.data.mensagem);
      if (
        error.response.data.mensagem === "Já existe uma sessão nesse horário."
      ) {
        message.error(
          "Já existe uma sessão nesse horário. Por favor, escolha outro horário."
        );
      } else {
        message.error("Erro ao salvar o agendamento. Tente novamente.");
      }
    }
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const formatDate = () => {
    if (view === "day") {
      return format(currentDate, "dd/MM/yyyy", { locale: ptBR });
    } else if (view === "week") {
      return `Semana de ${format(currentDate, "dd/MM/yyyy", { locale: ptBR })}`;
    } else {
      return capitalizeFirstLetter(
        format(currentDate, "MMMM yyyy", { locale: ptBR })
      );
    }
  };

  return (
    <div className="d-flex flex-column h-100 w-100">
      <section className="bg-white px-3 py-2 ant-rounded d-flex mb-3">
        <div className="d-flex align-items-center justify-content-around w-50">
          <button onClick={() => handleDateChange("prev")}>
            <BsChevronLeft />
          </button>
          <div className="w-50 text-center">{formatDate()}</div>
          <button onClick={() => handleDateChange("next")}>
            <BsChevronRight />
          </button>
        </div>
        <span className="border"></span>
        <div className="d-flex align-items-center justify-content-around w-100 ">
          <button
            className={
              view === "month" ? "button-text-primary" : "button-text-gray"
            }
            onClick={() => setView("month")}
          >
            Mês
          </button>
          <button
            className={
              view === "week" ? "button-text-primary" : "button-text-gray"
            }
            onClick={() => setView("week")}
          >
            Semana
          </button>
          <button
            className={
              view === "day" ? "button-text-primary" : "button-text-gray"
            }
            onClick={() => setView("day")}
          >
            Dia
          </button>
        </div>
        <span className="border"></span>
        <div className="d-flex align-items-center justify-content-around w-50 pl-3">
          <button
            className="button button-primary w-100"
            onClick={() => setIsModalOpen(true)}
          >
            <BsPlus size={24} /> Novo agendamento
          </button>
        </div>
      </section>
      <NovoAgendamentoModal
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSave={handleSaveAgendamento}
      />

      {view === "month" && (
        <MesView currentDate={currentDate} appointments={appointments} />
      )}
      {view === "week" && (
        <SemanaView currentDate={currentDate} appointments={appointments} />
      )}
      {view === "day" && (
        <DiaView currentDate={currentDate} appointments={appointments} />
      )}
    </div>
  );
};

export default Agenda;
