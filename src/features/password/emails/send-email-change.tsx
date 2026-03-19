import EmailChange from "@/emails/account/email-change";
import { resend } from "@/lib/resend";

export const sendEmailChange = async (
  user: string | null | undefined,
  email: string,
  newEmail: string,
  confirmationLink: string,
) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to: email,
    subject: "Email Change Review",
    react: (
      <EmailChange toName={user} newEmail={newEmail} url={confirmationLink} />
    ),
  });
};
