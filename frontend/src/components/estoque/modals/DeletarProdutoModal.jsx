import { Button, Modal } from "antd";
import React from "react";

const DeletarProdutoModal = ({ isVisible, onClose, produto, onDelete }) => {
  const handleDelete = async () => {
    if (produto?.id) {
      await onDelete(produto.id);
    }
  };

  return (
    <Modal
      title="Deletar Produto"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <p>
        Tem certeza que deseja deletar o produto{" "}
        <strong>{produto?.nome}</strong>?
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

export default DeletarProdutoModal;
