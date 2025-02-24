import { Form, Input, message, Modal } from "antd";
import React, { useEffect } from "react";
import InputMask from "react-input-mask";

function EditarFornecedorModal({ isVisible, onClose, fornecedor, onUpdate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isVisible && fornecedor) {
      form.setFieldsValue({
        nome: fornecedor.nome,
        telefone: fornecedor.telefone,
        email: fornecedor.email,
      });
    }
  }, [isVisible, fornecedor, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      await onUpdate(fornecedor.id, values);
      message.success("Fornecedor atualizado com sucesso!");
      handleCancel();
    } catch (error) {
      message.error("Erro ao atualizar fornecedor: " + error.message);
    }
  };

  return (
    <Modal
      title="Editar Fornecedor"
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form
        form={form}
        name="editarFornecedor"
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
            Atualizar Fornecedor
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditarFornecedorModal;
