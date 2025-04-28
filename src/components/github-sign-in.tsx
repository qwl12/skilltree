import { signIn } from "next-auth/react";


const GithubSignIn = () => {
    return (
        <form 
            action={async () => {
                "use server"
                await signIn("github");
            }}
        >
            <button>Продолжить через GitHub</button>
        </form>
    );
};
export {GithubSignIn};