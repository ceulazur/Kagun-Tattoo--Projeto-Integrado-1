import { Form, Input, Modal, message } from "antd";
import React from "react";
import InputMask from "react-input-mask";

function NovoFornecedorModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await handleSave(values);
      form.resetFields();
    } catch (error) {
      message.error("Erro ao criar fornecedor: " + error.message);
    }
  };

  return (
    <Modal
      title="Novo Fornecedor"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        name="novoFornecedor"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="nome"
          label="Nome"
          rules={[
            {
              required: true,
              message: "Por favor, insira o nome do fornecedor!",
            },
          ]}
          className="mb-2"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="telefone"
          label="Telefone"
          rules={[
            {
              required: true,
              message: "Por favor, insira o telefone!",
            },
          ]}
          className="mb-2"
        >
          <InputMask
            mask="(99) 99999-9999"
            onChange={(e) => form.setFieldsValue({ telefone: e.target.value })}
          >
            {(inputProps) => (
              <Input {...inputProps} placeholder="(99) 99999-9999" />
            )}
          </InputMask>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Por favor, insira o email!" },
            { type: "email", message: "Email inválido!" },
          ]}
          className="mb-2"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <button htmlType="submit" block className="button button-primary">
            Salvar Fornecedor
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default NovoFornecedorModal;
