import { Button, Modal, message } from "antd";
import React from "react";

const DeletarUsuarioModal = ({ isVisible, onClose, usuario, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(usuario.id);
      message.success("Usuário deletado com sucesso!");
      onClose();
    } catch (error) {
      message.error("Erro ao deletar o usuário. Tente novamente.");
    }
  };

  return (
    <Modal
      title="Deletar Usuário"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <p>Tem certeza que deseja deletar o usuário {usuario?.nome}?</p>
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

export default DeletarUsuarioModal;
