"use server";

import { signIn } from "auth";
import { AuthError } from "next-auth";

const loginAction = async (formData: FormData) => {
    try {

        await signIn("credentials", formData);

    } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            throw error; // Re-throw to allow redirect
        }

        console.error("Login error:", error);

        if (error instanceof AuthError) {
            return { error: "Invalid credentials" };
        }
        return { error: "Something went wrong" };
    }
};

export default loginAction;