import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { loginSchema, type LoginSchemaForm } from "../../schemas/authSchemas";
import Input from "../../components/atoms/Input";
import { isEmpty } from "../../utils/dataUtils";
import z from "zod";
import Button from "../../components/atoms/Button";

const Signup = () => {
  const [form, setForm] = useState<LoginSchemaForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const signupMutation = useSignup();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (!value) {
      return setErrors({});
    }

    const result = loginSchema.safeParse(updatedForm);

    if (!result.success) {
      const { fieldErrors, formErrors } = z.flattenError(result.error);

      const fieldError = fieldErrors[name as keyof typeof fieldErrors]?.[0];
      const passwordUnmatchError =
        name === "password"
          ? form.confirmPassword.length > 0 && formErrors[0]
          : name === "confirmPassword" && value.length > 0 && formErrors[0];

      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || passwordUnmatchError || "",
      }));
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signupMutation.mutate(form, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      },
    });
  };

  const isSubmitDisabled =
    !Boolean(
      form.email && form.name && form.password && form.confirmPassword,
    ) || !isEmpty(errors);

  return (
    <div className="flex flex-col justify-center">
      <div className="w-full max-w-md m-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comienza a crear encuestas en segundos
          </p>
        </div>
        <div className="rounded-3xl border border-border card p-8 shadow-sm">
          <p
            className={`error-label ${
              signupMutation.isError ? "visible" : "invisible"
            }`}
          >
            {signupMutation?.error?.status === 400
              ? "El correo ingresado ya existe, usa uno diferente"
              : "Error al registrarte"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Nombre"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              error={errors.email}
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              error={errors.password}
            />
            <Input
              label="Confirma tu contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
              error={errors.confirmPassword}
            />
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="button self-center"
            >
              {signupMutation.isPending ? "Enviando..." : "Registrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
