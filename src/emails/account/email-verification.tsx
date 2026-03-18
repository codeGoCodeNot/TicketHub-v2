import { Button, Section, Text } from "@react-email/components";
import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";

type EmailVerificationProps = {
  toName?: string | null;
  url: string;
};

const EmailVerification = ({ toName, url }: EmailVerificationProps) => {
  const recipient = toName?.trim();

  return (
    <TicketHubEmailLayout
      preview="Verify your TicketHub email"
      title="Verify your email"
      description={`Hi ${recipient}, please verify your email to complete your TicketHub signup.`}
    >
      <Section className="mb-[18px] text-center">
        <Button
          href={url}
          className="inline-block rounded-[10px] bg-[#b85c2c] px-[18px] py-3 text-[14px] font-bold text-white no-underline"
        >
          Verify Email
        </Button>
      </Section>

      <Text className="m-0 mb-2 text-center text-[14px] leading-[1.6] text-[#6f5b4e]">
        If you did not create this account, you can safely ignore this email.
      </Text>
      <Text className="m-0 break-all text-[12px] leading-[1.5] text-[#8a7668]">
        {url}
      </Text>
    </TicketHubEmailLayout>
  );
};

EmailVerification.PreviewProps = {
  toName: "Johnsen Berdin",
  url: "https://localhost:3000/verify-email/abc123",
};

export default EmailVerification;
