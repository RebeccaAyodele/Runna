import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendVerificationOtpEmail = async (email: string, code: string): Promise<void> => {
    console.log(`\x1b[32m[RUNNA OTP] Verification code for ${email}: ${code}\x1b[0m`);

    if (resend) {
        try {
            await resend.emails.send({
                from: process.env.EMAIL_FROM || 'Runna <onboarding@resend.dev>',
                to: email,
                subject: 'Your Runna Verification Code',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eaeaea; rounded: 16px;">
                        <h2 style="color: #1550ff; margin-bottom: 8px;">Runna Verification</h2>
                        <p style="color: #333; font-size: 16px;">Welcome to Runna! Use the 6-digit verification code below to activate your student account:</p>
                        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1550ff;">${code}</span>
                        </div>
                        <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
                    </div>
                `
            });
            console.log(`[EMAIL SENT] Verification email delivered via Resend to ${email}`);
        } catch (error) {
            console.error('Failed to send verification email via Resend:', error);
        }
    }
};
