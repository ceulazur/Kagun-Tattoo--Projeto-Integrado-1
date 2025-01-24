import { Form, Input, DatePicker, TimePicker, Modal, message, Button } from "antd";
import { useState, useEffect } from "react";
import moment from "moment";

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

            if (!nome || !data || !hora || !duracao) {
                throw new Error("Todos os campos são obrigatórios");
            }

            const dataHora = moment(data).set({
                hour: hora.hour(),
                minute: hora.minute(),
                second: 0,
            });

            await onUpdate({ ...agendamento, nome, data: dataHora, duracao });

            message.success("Agendamento atualizado com sucesso!");
            handleCancel();
        } catch (err) {
            message.error(err.message || "Erro ao atualizar agendamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Editar Agendamento" visible={isVisible} onCancel={handleCancel} footer={null}>
            <Form form={form} name="editarAgendamento" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="nome"
                    label="Nome do Agendamento"
                    rules={[{ required: true, message: "Por favor, insira o nome do agendamento!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="data" label="Data" rules={[{ required: true, message: "Selecione a data!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="hora" label="Hora" rules={[{ required: true, message: "Selecione a hora!" }]}>
                    <TimePicker style={{ width: "100%" }} format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="duracao"
                    label="Duração Estimada (minutos)"
                    rules={[{ required: true, message: "Insira a duração estimada!" }]}
                >
                    <Input type="number" />
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