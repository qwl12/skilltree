// src/components/RegisterForm.tsx
"use client";

import { useState } from "react";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setSuccess(null);
    } else {
      setSuccess("Успешная регистрация! Теперь вы можете войти.");
      setError(null);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-3">
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg p-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg p-2"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded-lg p-2"
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegisterForm;
