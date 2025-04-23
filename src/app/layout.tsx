
import Header from "@/components/Header";
import '../styles/tailwind.css';


import { Inria_Sans } from "next/font/google";

const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
     <body className={`${inria.className}  `}>
      <Header />
        {children}
      </body>
    </html>
  );
}
