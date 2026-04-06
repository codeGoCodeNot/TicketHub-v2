export const homePagePath = () => "/";

// ticket
export const ticketsPagePath = () => "/tickets";
export const ticketPagePath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPagePath = (ticketId: string) =>
  `/tickets/${ticketId}/edit`;
export const ticketsByOrganizationPagePath = () => "/tickets/organization";

// auth
export const signUpPagePath = () => "/sign-up";
export const signInPagePath = () => "/sign-in";
export const passwordForgotPagePath = () => "/password-forgot";

// account
export const accountProfilePagePath = () => "/account/profile";
export const accountPasswordPagePath = () => "/account/password";

// email verification
export const emailVerificationPagePath = () => "/email-verification";

// organization
export const organizationPagePath = () => "/organization";
export const organizationCreatePagePath = () => "/organization/create";
export const organizationMembershipPagePath = (organizationId: string) =>
  `/organization/${organizationId}/memberships`;
export const organizationSettingsPagePath = (organizationId: string) =>
  `/organization/${organizationId}/settings`;
export const organizationCredentialsPagePath = (organizationId: string) =>
  `/organization/${organizationId}/credentials`;
export const organizationCredentialUsagePagePath = (organizationId: string) =>
  `/organization/${organizationId}/usage`;

// invitation
export const organizationInvitationPagePath = (organizationId: string) =>
  `/organization/${organizationId}/invitations`;

// onboard
export const onboardPath = () => "/onboarding";
export const selectActiveOrganizationPath = () =>
  "/onboarding/select-active-organization";

// aws
export const attachmentDownloadPagePath = (attachmentId: string) =>
  `/api/aws/s3/attachments/${attachmentId}`;
