import { message, Space, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { excluirProduto, listarProdutos } from "../api/entities/produtos";
import DeletarProdutoModal from "../components/estoque/modals/DeletarProdutoModal";
import EditarProdutoModal from "../components/estoque/modals/EditarProdutoModal";
import NovoProdutoModal from "../components/estoque/modals/NovoProdutoModal";

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarProdutos();
      setProdutos(data);
    } catch (error) {
      message.error("Não foi possível carregar os produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const handleEdit = (produto) => {
    setSelectedProduto(produto);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await excluirProduto(id);
      message.success("Produto excluído com sucesso!");
      fetchProdutos();
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Erro ao excluir o produto");
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      sorter: (a, b) => a.nome.localeCompare(b.nome),
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
    },
    {
      title: "Validade",
      dataIndex: "validade",
      key: "validade",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Quantidade",
      dataIndex: "quantidade",
      key: "quantidade",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
    },
    {
      title: "Estoque Mínimo",
      dataIndex: "estoqueMinimo",
      key: "estoqueMinimo",
    },
    {
      title: "Fornecedor",
      dataIndex: ["fornecedor", "nome"],
      key: "fornecedor",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <button type="transparent" onClick={() => handleEdit(record)}>
            <BsFillPencilFill color="var(--color-primary)" size={18} />
          </button>
          <button
            type="transparent"
            onClick={() =>
              setIsDeleteModalOpen(true) || setSelectedProduto(record)
            }
          >
            <BsFillTrashFill color="var(--color-red)" size={18} />
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
          Novo Produto
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={produtos}
        rowKey="id"
        loading={loading}
      />

      <NovoProdutoModal
        isModalOpen={isNewModalOpen}
        handleClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchProdutos}
      />

      <EditarProdutoModal
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        produto={selectedProduto}
        onSuccess={fetchProdutos}
      />

      <DeletarProdutoModal
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        produto={selectedProduto}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Estoque;
