import { authenticator } from "otplib";

export function generateTotpFromEnv(): string {
    const secret = process.env.TOTP_SECRET;
    if(!secret){
        throw new Error("TOTP_SECRET is not set in environment variables.");
    }
    return authenticator.generate(secret);
}