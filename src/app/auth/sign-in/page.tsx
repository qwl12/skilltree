import { GithubSignIn } from "@/components/github-sign-in"

import Link from "next/link";

const Page = async () => {

    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Войти</h2>
        
            <GithubSignIn/>
        
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="border-t"/>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-2 text-muted-foreground">Продолжить через email</span>
                </div>
            </div>

            <form action={ async () => {
                "use server";
            }}>
                <input name="email" placeholder="Email"  type="email" required autoComplete="email" />
                <input name="password" placeholder="Пароль"  type="password" required autoComplete="current-password" />
                <button>Войти</button>
            </form>

            <div>
                <button><Link href="/sign-up">Создать аккаунт</Link></button>
            </div>

        </div>


       
    )
}

export {Page}