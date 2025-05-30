import { Inria_Sans } from "next/font/google";
import Link from "next/link";
const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-12 mt-35">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
        <Link rel="stylesheet" href="/" className={`${inria.className} text-3xl font-bold text-green-600 hover:text-green-700 transition`}>SkillTree</Link>
          <p className="text-sm text-white">
            Образовательная платформа для развития навыков и роста.
          </p>
        </div>

        <div>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white hover:text-blue-400 transition">
                Авторам курсов
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-400 transition">
                Помощь
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-400 transition">
                Контакты
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-400 transition">
                О проекте
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="flex space-x-4 text-l  flex-col gap-2">
            <a href="#" className="text-white hover:text-blue-400 transition">
              +7 (911) 1776509
            </a>
            <a href="#" className="text-white hover:text-blue-400 transition">
              CherryTon@mail.ru
            </a>
            <a href="#" className="text-white hover:text-blue-400 transition">
              Github
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkillTree. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
