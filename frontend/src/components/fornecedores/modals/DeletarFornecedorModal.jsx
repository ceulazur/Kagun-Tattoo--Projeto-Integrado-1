import { Button, Modal, message } from "antd";
import React from "react";

const DeletarFornecedorModal = ({
  isVisible,
  onClose,
  fornecedor,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(fornecedor.id);
      message.success("Fornecedor deletado com sucesso!");
      onClose();
    } catch (error) {
      message.error("Erro ao deletar o fornecedor. Tente novamente.");
    }
  };

  return (
    <Modal
      title="Deletar Fornecedor"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <p>
        Tem certeza que deseja deletar o fornecedor{" "}
        <strong>{fornecedor?.nome}</strong>?
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

export default DeletarFornecedorModal;
