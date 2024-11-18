import { Button, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Error = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/");
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div
        className="w-100 p-4 bg-light rounded shadow"
        style={{ maxWidth: 600 }}
      >
        <Title level={2} className="mb-4">
          Erro de Conexão
        </Title>
        <Paragraph>
          Não foi possível conectar ao servidor. Por favor, verifique sua
          conexão com a internet ou tente novamente mais tarde.
        </Paragraph>
        <Button type="primary" onClick={handleRetry}>
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};

export default Error;
