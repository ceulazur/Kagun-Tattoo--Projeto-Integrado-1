import { Button, Form, Input, Modal, message } from "antd";
import React, { useEffect } from "react";
import InputMask from "react-input-mask";

function EditarUsuarioModal({ isVisible, onClose, usuario, onUpdate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isVisible && usuario) {
      form.setFieldsValue({
        nome: usuario.nome,
        telefone: usuario.telefone,
      });
    }
  }, [isVisible, usuario, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      await onUpdate({ ...usuario, ...values });
      message.success("Usuário atualizado com sucesso!");
      handleCancel();
    } catch (error) {
      message.error("Erro ao atualizar usuário: " + error.message);
    }
  };

  return (
    <Modal
      title="Editar Usuário"
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form
        form={form}
        name="editarUsuario"
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
            Atualizar Usuário
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditarUsuarioModal;
