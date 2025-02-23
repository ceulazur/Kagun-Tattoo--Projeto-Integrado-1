import { Button, Form, Input, Modal, message } from "antd";
import React from "react";
import InputMask from "react-input-mask";

function NovoUsuarioModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await handleSave(values);
      form.resetFields();
    } catch (error) {
      message.error("Erro ao criar usuário: " + error.message);
    }
  };

  return (
    <Modal
      title="Novo Usuário"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        name="novoUsuario"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="nome"
          label="Nome"
          rules={[
            {
              required: true,
              message: "Por favor, insira o nome do usuário!",
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

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Salvar Usuário
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default NovoUsuarioModal;
