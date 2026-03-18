import { Text } from "@react-email/components";
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
      toName={recipient}
      description="We received a request to reset your TicketHub password. Use the button below to continue."
      buttonLabel="Reset password"
      buttonUrl={url}
    >
      <Text className="m-0 mb-2 text-[14px] leading-[1.6] text-[#6b7280]">
        If you did not request this, you can safely ignore this email.
      </Text>
      <Text className="m-0 break-all text-[12px] leading-[1.5] text-[#94a3b8]">
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
