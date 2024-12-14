import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const Router = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route index element={<Home />} /> */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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
                  <Home />
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
