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
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { listarUsuarios } from "../../../api/entities/usuario";
import NovoUsuarioModal from "../../usuarios/modals/NovoUsuarioModal";

function EditarAgendamentoModal({ isVisible, onClose, agendamento, onUpdate }) {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (isVisible && agendamento) {
      const dataHorario = dayjs(agendamento.dataHorario);
      form.setFieldsValue({
        nomeCliente: agendamento.cliente.nome,
        idCliente: agendamento.cliente.id,
        data: dataHorario,
        hora: dataHorario,
      });

      setOptions([
        {
          value: agendamento.cliente.nome,
          label: `${agendamento.cliente.nome} - ${agendamento.cliente.telefone}`,
          id: agendamento.cliente.id,
        },
      ]);
    }
  }, [isVisible, agendamento, form]);

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

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const { idCliente, data, hora } = values;
      const dataHora = data.hour(hora.hour()).minute(hora.minute()).second(0);

      if (hora.hour() < 8 || hora.hour() > 18) {
        throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
      }

      const updatedAgendamento = {
        ...agendamento,
        idCliente,
        idTatuador: 1,
        dataHorario: dataHora.toISOString(),
      };

      await onUpdate(updatedAgendamento, agendamento.id);
      message.success("Agendamento atualizado com sucesso!");
      handleCancel();
    } catch (error) {
      message.error("Erro ao atualizar agendamento: " + error.message);
    }
  };

  const handleUserModalSave = async (userData) => {
    try {
      await criarUsuario(userData);
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
        title="Editar Agendamento"
        open={isVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          name="editarAgendamento"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="nomeCliente"
            label="Cliente"
            rules={[{ required: true, message: "Selecione um cliente!" }]}
            className="my-2"
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <AutoComplete
                options={options}
                onSearch={onSearch}
                onSelect={onSelect}
                placeholder="Buscar cliente"
                style={{ flex: 1 }}
                defaultValue={agendamento?.cliente?.nome}
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
              Atualizar Agendamento
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

export default EditarAgendamentoModal;
