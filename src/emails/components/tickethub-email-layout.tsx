import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import type { ReactNode } from "react";

type TicketHubEmailLayoutProps = {
  preview: string;
  title: string;
  description: string;
  children: ReactNode;
};

const TicketHubEmailLayout = ({
  preview,
  title,
  description,
  children,
}: TicketHubEmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="m-0 bg-[#f5eee7] px-3 py-6 font-sans text-[#3d2b22]">
          <Container className="mx-auto max-w-[560px] rounded-[14px] border border-[#ead8c9] bg-[#fffaf6] px-6 py-6 shadow-[0_8px_20px_rgba(64,40,25,0.08)]">
            <Section className="mb-[18px] text-center">
              <Text className="m-0 mr-2 inline-block rounded-[10px] bg-[#b85c2c] px-3 py-[10px] text-[14px] font-bold leading-none tracking-[0.08em] text-white">
                TH
              </Text>
              <Text className="m-0 inline-block text-[24px] font-bold leading-none tracking-[0.02em] text-[#5a3b2b]">
                TicketHub
              </Text>
            </Section>

            <Text className="m-0 mb-3 text-center text-[26px] font-bold leading-[1.2] text-[#412e24]">
              {title}
            </Text>
            <Text className="m-0 mb-5 text-center text-[15px] leading-[1.6] text-[#6f5b4e]">
              {description}
            </Text>

            <Section>{children}</Section>

            <Hr className="my-7 border-[#ead8c9]" />
            <Text className="m-0 text-center text-[12px] text-[#8a7668]">
              TicketHub v2 · Support and ticket operations made simple.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TicketHubEmailLayout;
