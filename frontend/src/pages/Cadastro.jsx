import { Form, Input, Typography, message } from "antd";
import React, { useContext, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/entities/user";
import { AuthContext } from "../AuthContext";
import { validateCPF, validateEmail } from "../utils/validation"; // Importar funções de validação

const { Title } = Typography;

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState(""); // Changed from phone
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const cpfInputRef = useRef(null);

  const onFinish = async () => {
    try {
      setError(null);
      if (
        !name ||
        !cpf ||
        !email ||
        !telefone ||
        !password ||
        !confirmPassword
      ) {
        throw new Error("Todos os campos são obrigatórios");
      }
      if (!validateCPF(cpf)) {
        throw new Error("CPF inválido");
      }
      if (!validateEmail(email)) {
        throw new Error("Email inválido");
      }
      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem");
      }
      await registerUser(cpf, name, email, telefone, password); // Changed from phone
      message.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.mensagem);
        message.error(err.response.data.mensagem);
        return;
      }
      setError(err.message);
      message.error(err.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 w-100 bg-custom-dark-gray">
      <div
        className="w-100 p-6 bg-custom-quaternary rounded shadow"
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
        <Form name="register" className="d-flex flex-column" layout="vertical">
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Por favor, insira seu nome!" }]}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3"
          >
            <Input placeholder="Nome" />
          </Form.Item>
          <Form.Item
            label="CPF"
            name="cpf"
            rules={[{ required: true, message: "Por favor, insira seu CPF!" }]}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="mb-3"
          >
            <InputMask
              mask="999.999.999-99"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            >
              {(inputProps) => (
                <Input {...inputProps} placeholder="CPF" ref={cpfInputRef} />
              )}
            </InputMask>
          </Form.Item>
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
            label="telefone"
            name="telefone"
            rules={[
              { required: true, message: "Por favor, insira seu telefone!" },
            ]}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="mb-3"
          >
            <InputMask
              mask="(99) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            >
              {(inputProps) => <Input {...inputProps} placeholder="telefone" />}
            </InputMask>
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
          <Form.Item
            label="Confirme a Senha"
            name="confirmPassword"
            rules={[
              { required: true, message: "Por favor, confirme sua senha!" },
            ]}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-3"
          >
            <Input.Password placeholder="Confirme a Senha" />
          </Form.Item>
          <Form.Item className="mb-0">
            <button
              disabled={loading}
              className="button button-hover"
              onClick={onFinish}
            >
              Cadastrar
            </button>
          </Form.Item>
        </Form>
        <p className="text-center fs-7 mt-3">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-hover">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
