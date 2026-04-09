import TicketHubEmailLayout from "@/emails/components/tickethub-email-layout";
import { Section, Text } from "@react-email/components";

type DeprovisionEmailProps = {
  toName?: string | null;
  organizationName: string;
  removedCount: number;
};

const DeprovisionEmail = ({
  toName,
  organizationName,
  removedCount,
}: DeprovisionEmailProps) => {
  const recipient = toName?.trim();
  return (
    <TicketHubEmailLayout
      preview="Your organization members have been removed"
      title="Membership limit reached"
      description={`Hi ${recipient}, your subscription plan for ${organizationName} has changed.`}
    >
      <Section className="mb-[18px] rounded-[10px] border border-[#ead8c9] bg-[#f7ede6] px-[14px] py-3">
        <Text className="m-0 mb-1 text-[12px] uppercase tracking-[0.08em] text-[#8a7668]">
          Members removed
        </Text>
        <Text className="m-0 text-[16px] font-bold text-[#3f2d24]">
          {removedCount} member(s) or invitation(s) were automatically removed.
        </Text>
      </Section>
      <Text className="m-0 mb-2 text-center text-[14px] leading-[1.6] text-[#6f5b4e]">
        To restore access, please upgrade your plan.
      </Text>
    </TicketHubEmailLayout>
  );
};

DeprovisionEmail.PreviewProps = {
  toName: "Johnsen Berdin",
  organizationName: "Stripe sample",
  removedCount: 3,
};

export default DeprovisionEmail;
