import { ProCard } from "@ant-design/pro-components";
import { ProForm, ProFormText } from "@ant-design/pro-form";
import { Typography, message } from "antd";
import React, { useState } from "react";
import { registerUser } from "../api/entities/user";

const { Title } = Typography;

const Register = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setError(null);
      setLoading(true);
      await registerUser(values);
      setLoading(false);
      message.success("Cadastro realizado com sucesso!");
    } catch (err) {
      setError("Falha no cadastro");
      setLoading(false);
      message.error("Falha no cadastro");
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <ProCard
        className="w-100 p-4 bg-light rounded shadow"
        style={{ maxWidth: 600 }}
        loading={loading}
      >
        <Title level={2} className="mb-4">
          Cadastro
        </Title>
        <ProForm
          onFinish={onFinish}
          submitter={{
            searchConfig: {
              submitText: "Cadastrar",
            },
            submitButtonProps: {
              loading: loading,
              block: true,
            },
            resetButtonProps: false,
          }}
        >
          <ProFormText
            name="email"
            placeholder="Email"
            rules={[
              { required: true, message: "Por favor, insira seu email!" },
            ]}
          />
          <ProFormText.Password
            name="password"
            placeholder="Senha"
            rules={[
              { required: true, message: "Por favor, insira sua senha!" },
            ]}
          />
          {error && <div className="text-danger mb-3">{error}</div>}
        </ProForm>
      </ProCard>
    </div>
  );
};

export default Register;
