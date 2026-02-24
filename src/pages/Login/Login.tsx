import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(form, {
      onSuccess: (data) => {
        login(data.token);
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="form-container">
      {loginMutation.isError && (
        <p className="error-label">{"Credenciales invalidas"}</p>
      )}
      <h2>Ingresar</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
        />
        <button
          className="button self-center mb-2"
          type="submit"
          disabled={!form.email || !form.password || loginMutation.isPending}
        >
          {loginMutation.isPending ? "Ingresando" : "Entrar"}
        </button>
      </form>
      <div className="divider"></div>
      <Link to="/signup" className="link text-sm">
        Registrarse
      </Link>
    </div>
  );
};

export default Login;
