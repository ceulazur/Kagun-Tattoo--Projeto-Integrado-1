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
import {
  agendarSessao,
  cancelarSessao,
  listarSessoes,
  reagendarSessao,
} from "../api/entities/sessao";
import DiaView from "../components/agenda/DiaView";
import MesView from "../components/agenda/MesView";
import DeletarAgendamentoModal from "../components/agenda/modals/DeletarAgendamentoModal";
import EditarAgendamentoModal from "../components/agenda/modals/EditarAgendamentoModal";
import NovoAgendamentoModal from "../components/agenda/modals/NovoAgendamentoModal";
import SemanaView from "../components/agenda/SemanaView";

const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(() => {
    return localStorage.getItem("agendaView") || "month";
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetAgendamentos = async () => {
    try {
      const response = await listarSessoes();
      setAppointments(response);
    } catch (error) {
      message.error("Erro ao carregar os agendamentos. Tente novamente.");
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

  const handleEditAgendamento = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleUpdateAgendamento = async (updatedAgendamento, appointmentId) => {
    console.log(updatedAgendamento);
    try {
      const response = await reagendarSessao(updatedAgendamento, appointmentId);
      if (response.status === 200) {
        message.success("Agendamento atualizado com sucesso!");
        handleGetAgendamentos();
      }
    } catch (error) {
      message.error("Erro ao atualizar o agendamento. Tente novamente.");
    }
  };

  const handleDeleteAgendamento = async (appointmentId) => {
    try {
      const response = await cancelarSessao(appointmentId);
      if (response.status === 200) {
        message.success("Agendamento deletado com sucesso!");
        handleGetAgendamentos();
      }
    } catch (error) {
      message.error("Erro ao deletar o agendamento. Tente novamente.");
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
      <EditarAgendamentoModal
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        agendamento={selectedAppointment}
        onUpdate={handleUpdateAgendamento}
      />
      <DeletarAgendamentoModal
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        appointment={selectedAppointment}
        onDelete={handleDeleteAgendamento}
      />

      {view === "month" && (
        <MesView
          currentDate={currentDate}
          appointments={appointments}
          handleEdit={handleEditAgendamento}
          handleDelete={(appointment) => {
            setSelectedAppointment(appointment);
            setIsDeleteModalOpen(true);
          }}
        />
      )}
      {view === "week" && (
        <SemanaView
          currentDate={currentDate}
          appointments={appointments}
          handleEdit={handleEditAgendamento}
          handleDelete={(appointment) => {
            setSelectedAppointment(appointment);
            setIsDeleteModalOpen(true);
          }}
        />
      )}
      {view === "day" && (
        <DiaView
          currentDate={currentDate}
          appointments={appointments}
          handleEdit={handleEditAgendamento}
          handleDelete={(appointment) => {
            setSelectedAppointment(appointment);
            setIsDeleteModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default Agenda;
