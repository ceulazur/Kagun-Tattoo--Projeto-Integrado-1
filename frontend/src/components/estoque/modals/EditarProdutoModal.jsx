import {
  AutoComplete,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { listarFornecedores } from "../../../api/entities/fornecedores";
import { atualizarProduto } from "../../../api/entities/produtos";

function EditarProdutoModal({ isVisible, onClose, produto, onSuccess }) {
  const [form] = Form.useForm();
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresOptions, setFornecedoresOptions] = useState([]);

  const categorias = [
    { value: "agulhas", label: "Agulhas" },
    { value: "tintas", label: "Tintas" },
    { value: "maquinas", label: "Máquinas" },
    { value: "biqueiras", label: "Biqueiras" },
    { value: "higiene", label: "Produtos de Higiene" },
    { value: "limpeza", label: "Materiais de Limpeza" },
    { value: "descartaveis", label: "Materiais Descartáveis" },
    { value: "epi", label: "EPIs" },
    { value: "esterilizacao", label: "Materiais de Esterilização" },
    { value: "acessorios", label: "Acessórios" },
  ];

  useEffect(() => {
    if (isVisible && produto) {
      form.setFieldsValue({
        ...produto,
        validade: dayjs(produto.validade),
        idFornecedor: produto.fornecedor.nome, // Changed to use nome instead of id
      });
    }
  }, [isVisible, produto, form]);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const data = await listarFornecedores();
        setFornecedores(data);
        setFornecedoresOptions(
          data.map((f) => ({ value: f.nome, label: f.nome })) // Changed from f.id to f.nome
        );
      } catch (error) {
        message.error("Erro ao carregar fornecedores");
      }
    };
    fetchFornecedores();
  }, []);

  const handleSearch = (value) => {
    const filtered = fornecedores
      .filter((f) => f.nome.toLowerCase().includes(value.toLowerCase()))
      .map((f) => ({ value: f.nome, label: f.nome })); // Changed to use nome as value
    setFornecedoresOptions(filtered);
  };

  const onFinish = async (values) => {
    try {
      // Find fornecedor id based on the selected name
      const fornecedor = fornecedores.find(
        (f) => f.nome === values.idFornecedor
      );
      if (!fornecedor) {
        throw new Error("Fornecedor não encontrado");
      }

      await atualizarProduto(produto.id, {
        ...values,
        validade: values.validade.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"), // Updated date format
        idFornecedor: fornecedor.id, // Use the found id
      });
      message.success("Produto atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Erro ao atualizar produto");
    }
  };

  return (
    <Modal
      title="Editar Produto"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="nome"
          label="Nome"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lote"
          label="Lote"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="validade"
          label="Validade"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="quantidade"
          label="Quantidade"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="categoria"
          label="Categoria"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            options={categorias}
            placeholder="Selecione uma categoria"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="estoqueMinimo"
          label="Estoque Mínimo"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="idFornecedor"
          label="Fornecedor"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <AutoComplete
            options={fornecedoresOptions}
            onSearch={handleSearch}
            placeholder="Selecione um fornecedor"
          />
        </Form.Item>

        <Form.Item>
          <button type="submit" className="button button-primary w-100">
            Atualizar
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditarProdutoModal;
