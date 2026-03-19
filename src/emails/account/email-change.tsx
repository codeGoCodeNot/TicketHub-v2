import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";
import { Button, Section, Text } from "@react-email/components";

type EmailChangeProps = {
  toName?: string | null;
  newEmail: string;
  url: string;
};

const EmailChange = ({ toName, newEmail, url }: EmailChangeProps) => {
  const recipient = toName?.trim();

  return (
    <TicketHubEmailLayout
      preview="Confirm your TicketHub email change"
      title="Confirm your email change"
      description={`Hi ${recipient}, we received a request to change your TicketHub email address.`}
    >
      <Section className="mb-[18px] rounded-[10px] border border-[#ead8c9] bg-[#f7ede6] px-[14px] py-3">
        <Text className="m-0 mb-1 text-[12px] uppercase tracking-[0.08em] text-[#8a7668]">
          New email address
        </Text>
        <Text className="m-0 text-[16px] font-bold text-[#3f2d24]">
          {newEmail}
        </Text>
      </Section>

      <Section className="mb-[18px] text-center">
        <Button
          href={url}
          className="inline-block rounded-[10px] bg-[#b85c2c] px-[18px] py-3 text-[14px] font-bold text-white no-underline"
        >
          Review email change
        </Button>
      </Section>

      <Text className="m-0 mb-2 text-center text-[14px] leading-[1.6] text-[#6f5b4e]">
        If you did not request this change, use the link above to secure your
        account.
      </Text>
    </TicketHubEmailLayout>
  );
};

EmailChange.PreviewProps = {
  toName: "Johnsen Berdin",
  newEmail: "newmail@example.com",
  url: "https://localhost:3000/account/confirm-email-change/abc123",
};

export default EmailChange;
