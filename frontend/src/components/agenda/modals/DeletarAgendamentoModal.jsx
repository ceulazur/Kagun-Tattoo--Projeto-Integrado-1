import { Button, Modal, message } from "antd";
import React from "react";

const DeletarAgendamentoModal = ({
  isVisible,
  onClose,
  appointment,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(appointment.id);
      onClose();
    } catch (error) {
      message.error("Erro ao deletar o agendamento. Tente novamente.");
    }
  };

  return (
    <Modal
      title="Deletar Agendamento"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <p>
        Tem certeza que deseja deletar o agendamento de{" "}
        {appointment?.nomeCliente}?
      </p>
      <div className="d-flex justify-content-end">
        <Button onClick={onClose} style={{ marginRight: "8px" }}>
          Cancelar
        </Button>
        <Button type="primary" danger onClick={handleDelete}>
          Deletar
        </Button>
      </div>
    </Modal>
  );
};

export default DeletarAgendamentoModal;
