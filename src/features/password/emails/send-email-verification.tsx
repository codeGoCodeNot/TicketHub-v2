import EmailVerification from "@/emails/account/email-verification";
import { resend } from "@/lib/resend";

export const sendEmailVerification = async (
  user: string | null | undefined,
  email: string,
  verificationLink: string,
) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to: email,
    subject: "Verify your email",
    react: <EmailVerification toName={user} url={verificationLink} />,
  });
};
