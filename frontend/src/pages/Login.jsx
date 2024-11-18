import { ProCard } from "@ant-design/pro-components";
import { ProForm, ProFormText } from "@ant-design/pro-form";
import { Typography, message } from "antd";
import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";

const { Title } = Typography;

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setError(null);
      await login(values.email, values.password);
      message.success("Login realizado com sucesso!");
    } catch (err) {
      setError("Email ou senha inválidos");
      message.error("Email ou senha inválidos");
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
          Login
        </Title>
        <ProForm
          onFinish={onFinish}
          submitter={{
            searchConfig: {
              submitText: "Login",
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

export default Login;
