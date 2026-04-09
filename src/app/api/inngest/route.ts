import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { passwordResetEvent } from "@/features/password/inngest/event-password-reset";
import { passwordResetEventSuccess } from "@/features/password/inngest/event-password-reset-success";
import { emailChangeEvent } from "@/features/password/inngest/event-email-change";
import { eventEmailVerification } from "@/features/password/inngest/event-email-verification";
import { organizationInvitationEvent } from "@/features/invitations/inngest/event-organization-invitation";
import { attachmentDeletedEvent } from "@/features/attachments/inngest/events-attachments-deleted";
import { eventOrganizationDeleted } from "@/features/attachments/inngest/event-organization-deleted";
import organizationCreatedEvent from "@/features/onboarding/inngest/event-organization-created";
import { deprovisionNotificationEvent } from "@/features/stripe/inngest/event-deprovision-notification";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetEvent,
    passwordResetEventSuccess,
    emailChangeEvent,
    eventEmailVerification,
    organizationInvitationEvent,
    attachmentDeletedEvent,
    eventOrganizationDeleted,
    organizationCreatedEvent,
    deprovisionNotificationEvent,
  ],
});
