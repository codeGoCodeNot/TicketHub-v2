import { Text } from "@react-email/components";
import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";

type EmailPasswordResetSuccessProps = {
  toName?: string | null;
  signInUrl: string;
};

const EmailPasswordResetSuccess = ({
  toName,
  signInUrl,
}: EmailPasswordResetSuccessProps) => {
  const recipient = toName?.trim() || "there";

  return (
    <TicketHubEmailLayout
      preview="Your TicketHub password was updated"
      title="Password reset successful"
      toName={recipient}
      description="Your password has been updated successfully. You can now sign in with your new password."
      buttonLabel="Sign in"
      buttonUrl={signInUrl}
    >
      <Text className="m-0 text-[14px] leading-[1.6] text-[#6b7280]">
        If this was not you, contact support immediately and review your recent
        account activity.
      </Text>
    </TicketHubEmailLayout>
  );
};

EmailPasswordResetSuccess.PreviewProps = {
  toName: "Johnsen Berdin",
  signInUrl: "https://localhost:3000/sign-in",
};

export default EmailPasswordResetSuccess;
