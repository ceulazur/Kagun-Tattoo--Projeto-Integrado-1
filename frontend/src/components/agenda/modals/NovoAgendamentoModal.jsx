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
import { set } from "date-fns";
import React from "react";

function NovoAgendamentoModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { nome, data, hora, duracao } = values;
      const dataHora = set(data.toDate(), {
        hours: hora.hour(),
        minutes: hora.minute(),
        seconds: 0,
      });

      if (hora.hour() < 8 || hora.hour() > 18) {
        throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
      }

      handleSave({ nome, dataHora, duracao });
      message.success("Agendamento salvo com sucesso!");
    } catch (error) {
      message.error(error.message || "Erro ao salvar agendamento.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error(
      "Erro ao enviar formulário: " + errorInfo.errorFields[0].errors[0]
    );
  };

  return (
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
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          name="nome"
          label="Nome do Agendamento"
          rules={[
            {
              required: true,
              message: "Por favor, insira o nome do agendamento!",
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

        <Form.Item
          name="duracao"
          label="Duração Estimada (horas)"
          rules={[
            {
              required: true,
              message: "Por favor, insira a duração estimada!",
            },
            {
              type: "number",
              min: 0.5,
              max: 24,
              message: "A duração deve ser entre 0.5 e 24 horas!",
            },
          ]}
          className="mb-2"
        >
          <InputNumber
            min={0.5}
            max={24}
            step={0.5}
            style={{ width: "100%" }}
            placeholder="Ex: 1.5 para 1 hora e 30 minutos"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Salvar Agendamento
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default NovoAgendamentoModal;
