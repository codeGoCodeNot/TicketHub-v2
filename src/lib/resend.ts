import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmailOptions) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to,
    subject,
    text,
  });
};
