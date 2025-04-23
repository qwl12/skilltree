'use client';
import Image from 'next/image';

import { Inria_Sans } from "next/font/google";

const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});


import { Inika } from "next/font/google";
import Link  from 'next/link';
import { usePathname } from 'next/navigation';


const Inika_font = Inika({
    subsets: ['latin'],
    weight: '400'
});

const Header = () => {
    const pathname = usePathname();

    return (
        <header className='bg-white shadow-md px-6 py-7 flex justify-around items-center'>
          <div className='flex items-center '>
          <Image
          src={'/logo.svg'}
          alt="logo"
          width={60}
          height={60}
          priority
          />
            <Link rel="stylesheet" href="/" className={`${inria.className} text-3xl font-bold text-green-600 hover:text-green-700 transition`}>SkillTree</Link>

            <nav className='space-x-4 flex px-10'>
                <Link href={'catalog'}  className={`text-black hover:text-green-700`}>Каталог</Link>
                <Image
                src={'/arrowdown.svg'}
                alt="logo"
                width={10}
                height={7}
                />
                <Link href={'catalog'} className={`text-black hover:text-green-700`}>Создать курс</Link>

            </nav>
          </div>
            <nav className='space-x-7'>
                
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Войти</button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Регистрация</button>
            </nav>
           

        </header>
    )
}
export default Header;