import { message, Space, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import {
  atualizarFornecedor,
  cadastrarFornecedor,
  excluirFornecedor,
  listarFornecedores,
} from "../api/entities/fornecedores";
import DeletarFornecedorModal from "../components/fornecedores/modals/DeletarFornecedorModal";
import EditarFornecedorModal from "../components/fornecedores/modals/EditarFornecedorModal";
import NovoFornecedorModal from "../components/fornecedores/modals/NovoFornecedorModal";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const fetchFornecedores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarFornecedores();
      setFornecedores(data);
    } catch (error) {
      message.error("Não foi possível carregar os fornecedores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handleSaveFornecedor = async (values) => {
    try {
      await cadastrarFornecedor(values.nome, values.telefone, values.email);
      message.success("Fornecedor cadastrado com sucesso!");
      fetchFornecedores();
      setIsNewModalOpen(false);
    } catch (error) {
      message.error("Erro ao cadastrar o fornecedor");
    }
  };

  const handleUpdateFornecedor = async (fornecedorId, values) => {
    try {
      await atualizarFornecedor(
        fornecedorId,
        values.nome,
        values.telefone,
        values.email
      );
      message.success("Fornecedor atualizado com sucesso!");
      fetchFornecedores();
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Erro ao atualizar o fornecedor");
    }
  };

  const handleDelete = async (id) => {
    try {
      await excluirFornecedor(id);
      message.success("Fornecedor excluído com sucesso!");
      fetchFornecedores();
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Erro ao excluir o fornecedor");
    }
  };

  const handleEdit = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      sorter: (a, b) => a.nome.localeCompare(b.nome),
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
              className="button-icon"
            />
          </button>
          <button type="transparent" onClick={() => handleDeleteClick(record)}>
            <BsFillTrashFill
              color="var(--color-red)"
              size={18}
              className="button-icon"
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
          Novo Fornecedor
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={fornecedores}
        rowKey="id"
        loading={loading}
      />

      <NovoFornecedorModal
        isModalOpen={isNewModalOpen}
        handleClose={() => setIsNewModalOpen(false)}
        handleSave={handleSaveFornecedor}
      />

      <EditarFornecedorModal
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fornecedor={selectedFornecedor}
        onUpdate={handleUpdateFornecedor}
      />

      <DeletarFornecedorModal
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        fornecedor={selectedFornecedor}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Fornecedores;
