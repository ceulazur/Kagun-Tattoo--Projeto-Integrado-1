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
import moment from "moment";
import { useEffect, useState } from "react";

function EditarAgendamentoModal({ isVisible, onClose, agendamento, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isVisible && agendamento) {
      form.setFieldsValue({
        nome: agendamento.nome,
        data: moment(agendamento.data),
        hora: moment(agendamento.hora, "HH:mm"),
        duracao: agendamento.duracao,
      });
    }
  }, [isVisible, agendamento, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { nome, data, hora, duracao } = values;

      const dataHora = moment(data).set({
        hour: hora.hour(),
        minute: hora.minute(),
        second: 0,
      });

      if (hora.hour() < 8 || hora.hour() > 18) {
        throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
      }

      await onUpdate({ ...agendamento, nome, data: dataHora, duracao });

      message.success("Agendamento atualizado com sucesso!");
      handleCancel();
    } catch (error) {
      message.error(error.message || "Erro ao atualizar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error(
      "Erro ao enviar formulário: " + errorInfo.errorFields[0].errors[0]
    );
  };

  return (
    <Modal
      title="Editar Agendamento"
      visible={isVisible}
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
          name="nome"
          label="Nome do Agendamento"
          rules={[
            {
              required: true,
              message: "Por favor, insira o nome do agendamento!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="data"
          label="Data"
          rules={[{ required: true, message: "Selecione a data!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="hora"
          label="Hora"
          rules={[
            { required: true, message: "Selecione a hora!" },
            {
              validator: (_, value) =>
                value && (value.hour() < 8 || value.hour() > 18)
                  ? Promise.reject(
                      "Os agendamentos devem ser entre 08:00 e 18:00."
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>
        <Form.Item
          name="duracao"
          label="Duração Estimada (minutos)"
          rules={[{ required: true, message: "Insira a duração estimada!" }]}
        >
          <InputNumber min={1} max={1440} step={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Atualizar Agendamento
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditarAgendamentoModal;
