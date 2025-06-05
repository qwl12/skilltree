import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Проверка, если пользователь уже авторизован
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
    if (session?.user?.role === "user") {
        router?.push("/dashboard/student");
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Неверный email или пароль");
    } else {

      await new Promise((res) => setTimeout(res, 500));
      const session = await getSession();

      if (session?.user?.role === "teacher") {
        router?.push("/dashboard/teacher") ;
      } else if (session?.user?.role === "user") {
        router?.push("/dashboard/student");
      } 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white ">
      <h2 className="text-xl font-semibold mb-4 ">Вход</h2>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

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
        onClick={() => router.push('/dashboard')}
        className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
