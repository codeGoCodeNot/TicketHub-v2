import { Button, Section, Text } from "@react-email/components";
import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";

type EmailPasswordResetProps = {
  toName?: string | null;
  url: string;
};

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => {
  const recipient = toName?.trim() || "there";

  return (
    <TicketHubEmailLayout
      preview="Reset your TicketHub password"
      title="Reset your password"
      description={`Hi ${recipient}, we received a request to reset your TicketHub password.`}
    >
      <Section className="mb-[18px] text-center">
        <Button
          href={url}
          className="inline-block rounded-[10px] bg-[#b85c2c] px-[18px] py-3 text-[14px] font-bold text-white no-underline"
        >
          Reset Password
        </Button>
      </Section>

      <Text className="m-0 mb-2 text-center text-[14px] leading-[1.6] text-[#6f5b4e]">
        If you did not request this, you can safely ignore this email.
      </Text>
      <Text className="m-0 break-all text-[12px] leading-[1.5] text-[#8a7668]">
        {url}
      </Text>
    </TicketHubEmailLayout>
  );
};

EmailPasswordReset.PreviewProps = {
  toName: "Johnsen Berdin",
  url: "https://localhost:3000/password-reset/abc123",
};

export default EmailPasswordReset;
