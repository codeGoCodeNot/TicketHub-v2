import EmailPasswordReset from "@/emails/password/email-password-reset";
import { resend } from "@/lib/resend";

export const sendEmailPasswordReset = async (
  user: string | null | undefined,
  email: string,
  passwordResetLink: string,
) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to: email,
    subject: "Password Reset Request",
    react: <EmailPasswordReset toName={user} url={passwordResetLink} />,
  });
};
