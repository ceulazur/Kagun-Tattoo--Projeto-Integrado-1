import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  TimePicker,
  message,
} from "antd";
import React, { useState } from "react";
import { criarUsuario } from "../../../api/entities/usuario";
import NovoUsuarioModal from "../../usuarios/modals/NovoUsuarioModal";

function NovoAgendamentoModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleUserModalSave = async (userData) => {
    try {
      const response = await criarUsuario(userData);
      form.setFieldsValue({
        nomeCliente: userData.nome,
        telefoneCliente: userData.telefone,
      });
      setIsUserModalOpen(false);
      message.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      message.error("Erro ao cadastrar usuário: " + error.message);
    }
  };

  const onFinish = async (values) => {
    const { nomeCliente, telefoneCliente, data, hora } = values;
    const dataHora = data.hour(hora.hour()).minute(hora.minute()).second(0);

    if (hora.hour() < 8 || hora.hour() > 18) {
      throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
    }

    const novoAgendamento = {
      nomeCliente,
      telefoneCliente,
      data: dataHora.format("YYYY-MM-DD"),
      horario: dataHora.format("HH:mm"),
      idTatuador: 1,
    };

    await handleSave(novoAgendamento);
  };

  return (
    <>
      <Modal
        title="Novo Agendamento"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <Form
          form={form}
          name="novoAgendamento"
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="d-flex align-items-center mb-3">
            <Button
              type="primary"
              onClick={() => setIsUserModalOpen(true)}
              style={{ marginRight: "10px" }}
            >
              Cadastrar Novo Cliente
            </Button>
          </div>

          <Form.Item
            name="nomeCliente"
            label="Nome do Cliente"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do cliente!",
              },
            ]}
            className="mb-2"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telefoneCliente"
            label="Telefone do Cliente"
            rules={[
              {
                required: true,
                message: "Por favor, insira o telefone!",
              },
              {
                pattern: /^\(\d{2}\) \d{5}-\d{4}$/,
                message: "Formato inválido. Use: (99) 99999-9999",
              },
            ]}
            className="mb-2"
          >
            <Input placeholder="(99) 99999-9999" />
          </Form.Item>

          <Form.Item
            name="data"
            label="Data"
            rules={[
              { required: true, message: "Por favor, selecione a data!" },
            ]}
            className="mb-2"
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="hora"
            label="Hora"
            rules={[
              { required: true, message: "Por favor, selecione a hora!" },
              {
                validator: (_, value) =>
                  value && (value.hour() < 8 || value.hour() > 18)
                    ? Promise.reject(
                        "Os agendamentos devem ser entre 08:00 e 18:00."
                      )
                    : Promise.resolve(),
              },
            ]}
            className="mb-2"
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar Agendamento
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <NovoUsuarioModal
        isModalOpen={isUserModalOpen}
        handleClose={() => setIsUserModalOpen(false)}
        handleSave={handleUserModalSave}
      />
    </>
  );
}

export default NovoAgendamentoModal;
