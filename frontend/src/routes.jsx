import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Agenda from "./pages/Agenda";
import Cadastro from "./pages/Cadastro";
import Error from "./pages/Error";
import Estoque from "./pages/Estoque";
import Fornecedores from "./pages/Fornecedores";
import ListagemAgendamentos from "./pages/ListagemAgendamentos";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const Router = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route index element={<Home />} /> */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Cadastro />} />
          <Route path="error" element={<Error />} />
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />
          {/* Rotas protegidas */}
          <Route
            index
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Agenda />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Agenda />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiais/estoque"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Estoque />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiais/fornecedores"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Fornecedores />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda/listagem"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ListagemAgendamentos />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Footer />
    </HashRouter>
  );
};

export default Router;
