import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";

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
    <div className="flex flex-col justify-center">
      <div className="w-full max-w-md m-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenid@ de vuelta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa para ver tus encuestas
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          {loginMutation.isError && (
            <p className="error-label">{"Credenciales invalidas"}</p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="lana@ejemplo.com"
              required
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
            />
            <Button
              className="button self-center mb-2"
              type="submit"
              disabled={
                !form.email || !form.password || loginMutation.isPending
              }
            >
              {loginMutation.isPending ? "Ingresando" : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default Login;
