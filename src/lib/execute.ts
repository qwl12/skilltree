import { isRedirectError } from "next/dist/client/components/redirect-error";
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external";
import { Carter_One } from "next/font/google";


type Options<T> = {
    actionFn: () => Promise<T>;
    successMessage?:string;
};

const executeAction = async <T>({
    actionFn,
    successMessage = "Все гуд",
}: Options<T>): Promise<{success:boolean; message:string}> => {
    try {
        await actionFn();

        return{
            success:true,
            message:successMessage,
        };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            success:false,
            message:" ошибка во время выполнения"
        };
    }
}

export {executeAction}