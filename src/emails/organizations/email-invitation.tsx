import { Button, Section, Text } from "@react-email/components";
import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";

type EmailInvitationProps = {
  invitedByUsername?: string | null;
  invitedByEmail?: string | null;
  organizationName?: string | null;
  inviteLink?: string | null;
};

const EmailInvitation = ({
  invitedByUsername,
  invitedByEmail,
  organizationName,
  inviteLink,
}: EmailInvitationProps) => {
  return (
    <TicketHubEmailLayout
      preview={`You've been invited to join ${organizationName} on TicketHub`}
      title="Organization Invitation"
      description={`${invitedByUsername} (${invitedByEmail}) has invited you to join ${organizationName}.`}
    >
      <Section className="mb-[18px] rounded-[10px] border border-[#ead8c9] bg-[#f7ede6] px-[14px] py-3">
        <Text className="m-0 mb-1 text-[16px] font-bold text-[#3f2d24]">
          You have been invited
        </Text>
        <Text className="m-0 text-[14px] leading-[1.6] text-[#6f5b4e]">
          Click the button below to accept the invitation and join{" "}
          {organizationName}.
        </Text>
      </Section>
      <Section className="mb-[18px] text-center">
        <Button
          href={inviteLink ?? "#"}
          className="inline-block rounded-[10px] bg-[#b85c2c] px-[18px] py-3 text-[14px] font-bold text-white no-underline"
        >
          Accept Invitation
        </Button>
      </Section>
      <Text className="m-0 text-center text-[14px] leading-[1.6] text-[#6f5b4e]">
        If you did not expect this invitation, you can safely ignore this email.
      </Text>
    </TicketHubEmailLayout>
  );
};

EmailInvitation.PreviewProps = {
  invitedByUsername: "Johnsen Berdin",
  invitedByEmail: "johnsen@example.com",
  organizationName: "TicketHub",
  inviteLink: "https://tickethubv2.johnsenb.dev/accept-invite?token=123",
};

export default EmailInvitation;
