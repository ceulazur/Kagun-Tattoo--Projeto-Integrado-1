import { PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Modal,
  TimePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { criarUsuario, listarUsuarios } from "../../../api/entities/usuario";
import NovoUsuarioModal from "../../usuarios/modals/NovoUsuarioModal";

function NovoAgendamentoModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await listarUsuarios();
      setUsers(response);
    } catch (error) {
      message.error("Erro ao carregar usuários");
    }
  };

  const onSearch = (searchText) => {
    const filtered = users
      .filter((user) =>
        user.nome.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((user) => ({
        value: user.nome,
        label: `${user.nome} - ${user.telefone}`,
        id: user.id,
      }));
    setOptions(filtered);
  };

  const onSelect = (value, option) => {
    form.setFieldsValue({
      idCliente: option.id,
    });
  };

  const onFinish = async (values) => {
    try {
      const { idCliente, data, hora } = values;
      const dataHora = data.hour(hora.hour()).minute(hora.minute()).second(0);

      if (hora.hour() < 8 || hora.hour() > 18) {
        throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
      }

      const novoAgendamento = {
        idCliente,
        idTatuador: 1, // Assuming fixed tatuador for now
        dataHorario: dataHora.toISOString(),
      };

      await handleSave(novoAgendamento);
      form.resetFields();
    } catch (error) {
      message.error("Erro ao criar agendamento: " + error.message);
    }
  };

  const handleUserModalSave = async (userData) => {
    try {
      const response = await criarUsuario(userData);
      await loadUsers();
      message.success("Usuário cadastrado com sucesso!");
      setIsUserModalOpen(false);
    } catch (error) {
      message.error("Erro ao cadastrar usuário: " + error.message);
    }
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
          <Form.Item
            name="nomeCliente"
            label="Cliente"
            className="my-2"
            rules={[{ required: true, message: "Selecione um cliente!" }]}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <AutoComplete
                options={options}
                onSearch={onSearch}
                onSelect={onSelect}
                placeholder="Buscar cliente"
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsUserModalOpen(true)}
                className="button button-primary"
              />
            </div>
          </Form.Item>

          <Form.Item name="idCliente" hidden>
            <input type="hidden" />
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
            <Button
              type="primary"
              htmlType="submit"
              block
              className="button button-primary mt-2"
            >
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
