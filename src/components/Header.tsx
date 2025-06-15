'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useState, useEffect, Suspense } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inria_Sans } from "next/font/google";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useSearchParams } from 'next/navigation';

const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});


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
            className="bg-white rounded-xl p-8 w-full max-w-md relative"
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
  
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); 
  
 const searchParams = useSearchParams();
const callbackUrl = searchParams.get('callbackUrl');
const avatarUrl = session?.user.id;
useEffect(() => {
  if (callbackUrl) {
    setIsModalOpen(true);
  }
}, [callbackUrl]);
  return (
    <header className="bg-white shadow-md px-6 py-7 flex justify-around items-center">
       <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center">
        <Image src="/logo.svg" alt="logo" width={60} height={60} priority />
        <Link href="/" className={`${inria.className} text-3xl font-bold text-green-600 hover:text-green-700 transition`}>
          SkillTree
        </Link>

        <nav className="space-x-4 flex px-10">

          <Link href="/create-course" className="text-black hover:text-green-700">Создать курс</Link>
          {status === "authenticated" ? (
          <Link href="/dashboard/student" className="text-black hover:text-green-700">Мое обучение</Link>
          ) : ('')}
       
            <Link href="/search" className="flex gap-2">
              <Image
              width={20}
              height={20}
              src={'/search.svg'}
              alt='search'
              />
              Поиск
          </Link>
        </nav>
      
      </div>
      <nav>
        {status === "authenticated" ? (
          <div className="flex items-center space-x-4">
              
            <Link href="/profile/student">
            <span>{session.user?.name}</span>
            </Link>
            <Link href="/profile/student">
    
                   {avatarUrl && (
         <img
            src={`/api/upload/users/${session?.user?.id}/avatar.jpg?t=${Date.now()}`}
            alt="Avatar"
            className="w-17 h-17 rounded-full object-cover shadow-md"
          />
          )}
            </Link>
            
            <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition">
              Выйти
            </button>
          </div>
        ) : (
          <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition">
            Войти
          </button>
        )}
      </nav>
     

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4 ">
          <h2 className={`${inria.className} text-2xl font-bold mb-1 text-center`}>
            {isLoginMode ? "Вход в SkillTree" : "Регистрация в SkillTree"}
          </h2>

          {isLoginMode ? <LoginForm /> : <RegisterForm />}

          <div className="text-center text-gray-400">или</div>

            <button
              onClick={() => signIn("github")}
              className="flex items-center justify-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Войти через GitHub
            </button>
          

          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="flex items-center justify-center bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isLoginMode ? "Регистрация" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </Modal>
      </Suspense>
    </header>
  );
};

export default Header;