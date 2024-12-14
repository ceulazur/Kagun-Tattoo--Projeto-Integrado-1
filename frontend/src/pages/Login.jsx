import { Form, Input, message } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async () => {
    try {
      setError(null);
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos");
      message.error("Email ou senha inválidos");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 w-100 bg-dark-gray">
      <div
        className="w-100 p-6 bg-quaternary rounded shadow"
        style={{ maxWidth: 400 }}
        loading={loading.toString()}
      >
        <div className="text-center mb-5 w-100">
          <img
            src={"assets/horizontal_logo.svg"}
            alt="Logo"
            className="w-100"
          />
        </div>
        <Form name="login" className="d-flex flex-column" layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor, insira seu email!" },
            ]}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3"
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[
              { required: true, message: "Por favor, insira sua senha!" },
            ]}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3"
          >
            <Input.Password placeholder="Senha" />
          </Form.Item>

          <Form.Item className="mb-0">
            <button
              disabled={loading}
              className="button button-hover"
              onClick={onFinish}
            >
              Login
            </button>
          </Form.Item>
        </Form>
        <p className="text-center fs-7 mt-3">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-hover">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
