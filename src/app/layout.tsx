
import Header from "@/components/Header";
import '../styles/tailwind.css';


import { Inria_Sans } from "next/font/google";
import AuthProvider from "@/components/sessionProvider";
import Footer from "@/components/ui/footer";
import { Suspense } from "react";

const inria = Inria_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inria.className}>
        <AuthProvider>
          <Suspense fallback={<div>Загрузка шапки...</div>}>
            <Header />
          </Suspense>

          {children}

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}