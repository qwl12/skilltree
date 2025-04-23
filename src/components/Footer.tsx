import { Inria_Sans } from "next/font/google";
const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer className="bg-gray-800  py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className={`${inria.className} text-4xl font-bold text-green-600`}>SkillTree</h2>
          <p className="text-sm text-white">
            Образовательная платформа для развития навыков и роста.
          </p>
        </div>

        {/* Navigation */}
        <div>

          <ul className="space-y-2">
            <li><a href="#" className="text-white hover:text-blue-400 transition">Авторам курсов</a></li>
            <li><a href="#" className="text-white hover:text-blue-400 transition">Помощь</a></li>
            <li><a href="#" className="text-white hover:text-blue-400 transition">Контакты</a></li>
            <li><a href="#" className="text-white hover:text-blue-400 transition">О проекте</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>

          <div className="flex space-x-4 text-l flex flex-col gap-2">
            <a href="#" className="text-white hover:text-blue-400 transition">+7 (911) 1776509</a>
            <a href="#" className="text-white hover:text-blue-400 transition">CherryTon@mail.ru</a>
            <a href="#" className="text-white hover:text-blue-400 transition">Github</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkillTree. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
