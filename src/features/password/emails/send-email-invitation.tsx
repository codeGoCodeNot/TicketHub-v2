import EmailInvitation from "@/emails/organizations/email-invitation";
import { resend } from "@/lib/resend";

export const sendEmailInvitation = async (
  email: string,
  invitedByUsername: string,
  invitedByEmail: string,
  organizationName: string,
  inviteLink: string,
) => {
  await resend.emails.send({
    from: "noreply@tickethubv2.johnsenb.dev",
    to: email,
    subject: `You've been invited to join ${organizationName}`,
    react: (
      <EmailInvitation
        invitedByUsername={invitedByUsername}
        invitedByEmail={invitedByEmail}
        organizationName={organizationName}
        inviteLink={inviteLink}
      />
    ),
  });
};
