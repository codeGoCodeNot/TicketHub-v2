import EmailPasswordResetSuccess from "@/emails/password/email-password-reset-success";
import { resend } from "@/lib/resend";

export const sendEmailPasswordResetSuccess = async (
  user: string | null | undefined,
  email: string,
) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to: email,
    subject: "Password Reset Successful",
    react: <EmailPasswordResetSuccess toName={user} />,
  });
};
