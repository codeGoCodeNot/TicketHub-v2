import DeprovisionEmail from "@/features/stripe/emails/deprovision-email";
import { resend } from "@/lib/resend";

export const sendDeprovisionEmail = async (
  toName: string | null | undefined,
  email: string,
  organizationName: string,
  removedCount: number,
) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to: email,
    subject: "Your organization membership has been updated",
    react: (
      <DeprovisionEmail
        toName={toName}
        organizationName={organizationName}
        removedCount={removedCount}
      />
    ),
  });
};
