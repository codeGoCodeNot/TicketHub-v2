import { Button, Section, Text } from "@react-email/components";
import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";

type EmailPasswordResetSuccessProps = {
  toName?: string | null;
};

const EmailPasswordResetSuccess = ({
  toName,
}: EmailPasswordResetSuccessProps) => {
  const recipient = toName?.trim();

  return (
    <TicketHubEmailLayout
      preview="Your TicketHub password was updated"
      title="Password reset successful"
      description={`Hi ${recipient}, your password has been updated successfully.`}
    >
      <Section className="mb-[18px] rounded-[10px] border border-[#ead8c9] bg-[#f7ede6] px-[14px] py-3">
        <Text className="m-0 mb-1 text-[16px] font-bold text-[#3f2d24]">
          Your account is secure
        </Text>
        <Text className="m-0 text-[14px] leading-[1.6] text-[#6f5b4e]">
          You can now sign in using your new password.
        </Text>
      </Section>

      <Section className="mb-[18px] text-center">
        <Button className="inline-block rounded-[10px] bg-[#b85c2c] px-[18px] py-3 text-[14px] font-bold text-white no-underline">
          Sign in to TicketHub
        </Button>
      </Section>

      <Text className="m-0 text-center text-[14px] leading-[1.6] text-[#6f5b4e]">
        If this was not you, contact support immediately and review your recent
        account activity.
      </Text>
    </TicketHubEmailLayout>
  );
};

EmailPasswordResetSuccess.PreviewProps = {
  toName: "Johnsen Berdin",
};

export default EmailPasswordResetSuccess;
