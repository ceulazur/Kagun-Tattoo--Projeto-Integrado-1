import { Form, Input, DatePicker, TimePicker, Modal, message, Button } from "antd";
import { useState } from "react";
import moment from "moment";

function NovoAgendamentoModal() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = async (e) => {
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

            message.success("Agendamento criado com sucesso!");
            handleCancel();
        } catch (err) {
            message.error(err.message || "Erro ao criar agendamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Novo Agendamento
            </Button>
            <Modal title="Novo Agendamento" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form form={form} name="novoAgendamento" onFinish={onFinish} layout="vertical">
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
                            Criar Agendamento
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default NovoAgendamentoModal

