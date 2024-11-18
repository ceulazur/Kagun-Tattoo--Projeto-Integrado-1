import { ProCard } from "@ant-design/pro-components";
import { Button, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <ProCard
        className="w-100 p-4 bg-light rounded shadow"
        style={{ maxWidth: 600 }}
        loading={false}
      >
        <Title level={2} className="mb-4">
          Bem-vindo ao Kagun Tattoo
        </Title>
        <Paragraph>
          Este é o sistema de gerenciamento de estoque e agendamento para o
          estúdio de tatuagem. Utilize o menu para navegar pelas funcionalidades
          disponíveis.
        </Paragraph>
        <div className="d-flex justify-content-between mt-4 w-100">
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button type="default" onClick={handleRegister}>
            Cadastro
          </Button>
        </div>
      </ProCard>
    </div>
  );
};

export default Home;
