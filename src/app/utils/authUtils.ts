const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendPasswordResetLink(email: string) {
    try {
        const response = await fetch(`${API_URL}/auth/send-reset-password-link/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.message || "Failed to send reset link",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Password reset request failed:", error);
        return {
            success: false,
            error: "Network error, please try again later",
        };
    }
}