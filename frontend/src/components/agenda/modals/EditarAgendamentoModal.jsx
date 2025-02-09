import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";

function EditarAgendamentoModal({ isVisible, onClose, agendamento, onUpdate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isVisible && agendamento) {
      form.setFieldsValue({
        nomeCliente: agendamento.nomeCliente,
        data: agendamento.data ? dayjs(agendamento.data) : null,
        hora: agendamento.horario ? dayjs(agendamento.horario) : null,
      });
    }
  }, [isVisible, agendamento, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { nomeCliente, data, hora } = values;
    const dataHora = data.hour(hora.hour()).minute(hora.minute()).second(0);

    if (hora.hour() < 8 || hora.hour() > 18) {
      throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
    }

    const updatedAgendamento = {
      ...agendamento,
      nomeCliente,
      data: dataHora.format("YYYY-MM-DD"),
      horario: dataHora.format("HH:mm"),
      idTatuador: 1,
    };

    await onUpdate(updatedAgendamento);
    message.success("Agendamento atualizado com sucesso!");
    handleCancel();
  };

  const onFinishFailed = (errorInfo) => {
    message.error(
      "Erro ao enviar formulário: " + errorInfo.errorFields[0].errors[0]
    );
  };

  return (
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
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
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
          name="data"
          label="Data"
          rules={[{ required: true, message: "Por favor, selecione a data!" }]}
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
            Atualizar Agendamento
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditarAgendamentoModal;
