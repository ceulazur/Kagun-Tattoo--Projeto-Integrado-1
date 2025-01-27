import React from "react"
import { Modal, Form, Input, DatePicker, TimePicker, InputNumber } from "antd"
import { set } from "date-fns"

function NovoAgendamentoModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    const { nome, data, hora, duracao } = values
    const dataHora = set(data.toDate(), {
      hours: hora.hour(),
      minutes: hora.minute(),
      seconds: 0,
    })
    
    handleOk({ nome, dataHora, duracao })
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  return (
    <Modal title="Novo Agendamento" open={isModalOpen} onCancel={handleClose} footer={null}>
      <Form form={form} name="novoAgendamento" onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          name="nome"
          label="Nome do Agendamento"
          rules={[{ required: true, message: "Por favor, insira o nome do agendamento!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="data" label="Data" rules={[{ required: true, message: "Por favor, selecione a data!" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="hora" label="Hora" rules={[{ required: true, message: "Por favor, selecione a hora!" }]}>
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        <Form.Item
          name="duracao"
          label="Duração Estimada (horas)"
          rules={[
            { required: true, message: "Por favor, insira a duração estimada!" },
            { type: "number", min: 0.5, max: 24, message: "A duração deve ser entre 0.5 e 24 horas!" },
          ]}
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
          <button type="submit" className="button button-primary w-100">
            Salvar Agendamento
          </button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NovoAgendamentoModal

