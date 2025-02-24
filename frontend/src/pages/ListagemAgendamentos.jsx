import { message, Space, Table, Tag } from "antd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import {
  agendarSessao,
  cancelarSessao,
  listarSessoes,
} from "../api/entities/sessao";
import DeletarAgendamentoModal from "../components/agenda/modals/DeletarAgendamentoModal";
import EditarAgendamentoModal from "../components/agenda/modals/EditarAgendamentoModal";
import NovoAgendamentoModal from "../components/agenda/modals/NovoAgendamentoModal";

const ListagemAgendamentos = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await listarSessoes();
      setAppointments(data);
    } catch (error) {
      message.error("Erro ao carregar os agendamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEdit = (record) => {
    setSelectedAppointment(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await cancelarSessao(id);
      if (response.status === 200) {
        message.success("Agendamento cancelado com sucesso!");
        fetchAppointments();
      }
    } catch (error) {
      message.error("Erro ao cancelar o agendamento");
    }
  };

  const handleUpdateAgendamento = async (updatedAgendamento, appointmentId) => {
    try {
      const response = await reagendarSessao(updatedAgendamento, appointmentId);
      if (response.status === 200) {
        message.success("Agendamento atualizado com sucesso!");
        fetchAppointments();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      message.error("Erro ao atualizar o agendamento");
    }
  };

  const handleSaveAgendamento = async (novoAgendamento) => {
    try {
      const response = await agendarSessao(novoAgendamento);
      if (response.status === 201) {
        message.success("Agendamento criado com sucesso!");
        fetchAppointments();
        setIsNewModalOpen(false);
      }
    } catch (error) {
      message.error("Erro ao criar o agendamento");
    }
  };

  const columns = [
    {
      title: "Cliente",
      dataIndex: ["cliente", "nome"],
      key: "cliente",
      sorter: (a, b) => a.cliente.nome.localeCompare(b.cliente.nome),
    },
    {
      title: "Telefone Cliente",
      dataIndex: ["cliente", "telefone"],
      key: "telefoneCliente",
    },
    {
      title: "Tatuador",
      dataIndex: ["tatuador", "nome"],
      key: "tatuador",
      sorter: (a, b) => a.tatuador.nome.localeCompare(b.tatuador.nome),
    },
    {
      title: "Data",
      dataIndex: "dataHorario",
      key: "dataHorario",
      render: (text) => format(new Date(text), "dd/MM/yyyy", { locale: ptBR }),
      sorter: (a, b) => new Date(a.dataHorario) - new Date(b.dataHorario),
    },
    {
      title: "Horário",
      dataIndex: "dataHorario",
      key: "horario",
      render: (text) => format(new Date(text), "HH:mm", { locale: ptBR }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status.toLowerCase() === "agendada" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <button type="transparent" onClick={() => handleEdit(record)}>
            <BsFillPencilFill
              color="var(--color-primary)"
              size={18}
              className="button-icon "
            />
          </button>
          <button
            type="transparent"
            onClick={() => {
              setSelectedAppointment(record);
              setIsDeleteModalOpen(true);
            }}
          >
            <BsFillTrashFill
              color="var(--color-red)"
              size={18}
              className="button-icon "
            />
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="d-flex justify-content-end mb-3">
        <button
          type="primary"
          onClick={() => setIsNewModalOpen(true)}
          className="button button-primary w-25"
        >
          Novo Agendamento
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        loading={loading}
      />

      <NovoAgendamentoModal
        isModalOpen={isNewModalOpen}
        handleClose={() => setIsNewModalOpen(false)}
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
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ListagemAgendamentos;
