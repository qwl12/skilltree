'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inria_Sans, Inika } from "next/font/google";

const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Inika_font = Inika({
  subsets: ['latin'],
  weight: '400'
});

// Модалка с анимацией
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="bg-white shadow-md px-6 py-7 flex justify-around items-center">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={60}
          height={60}
          priority
        />
        <Link href="/" className={`${inria.className} text-3xl font-bold text-green-600 hover:text-green-700 transition`}>
          SkillTree
        </Link>

        <nav className="space-x-4 flex px-10">
          <Link href="/catalog" className="text-black hover:text-green-700">Каталог</Link>
          <Image
            src="/arrowdown.svg"
            alt="arrow"
            width={10}
            height={7}
          />
          <Link href="/create-course" className="text-black hover:text-green-700">Создать курс</Link>
        </nav>
      </div>

      <nav className="space-x-7">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Войти
        </button>
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4 mb-5 mt-5">
          <h2 className={`${inria.className} text-2xl font-bold mb-6 text-center`}>Вход в SkillTree</h2>

          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="Пароль"
              className="border rounded-lg p-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Войти
            </button>
          </form>

          <div className="text-center text-gray-400">или</div>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Войти через GitHub
          </button>
          <button
            onClick={() => 0}
            className="flex items-center justify-center outline-solid-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Регистрация
          </button>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
