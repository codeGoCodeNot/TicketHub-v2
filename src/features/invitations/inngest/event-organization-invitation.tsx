import { inngest } from "@/lib/inngest";
import { sendEmailInvitation } from "../emails/send-email-invitation";

export const organizationInvitationEvent = inngest.createFunction(
  {
    id: "organization-invitation",
    triggers: { event: "app/organization.invitation" },
    retries: 6,
  },
  async ({ event }) => {
    const {
      email,
      inviteByUsername,
      invitedByEmail,
      organizationName,
      inviteLink,
    } = event.data;

    const result = await sendEmailInvitation(
      email,
      inviteByUsername,
      invitedByEmail,
      organizationName,
      inviteLink,
    );

    return { event, body: result };
  },
);
