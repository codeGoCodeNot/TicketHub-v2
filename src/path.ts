export const homePagePath = () => "/";

// ticket
export const ticketsPagePath = () => "/tickets";
export const ticketPagePath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPagePath = (ticketId: string) =>
  `/tickets/${ticketId}/edit`;

// auth
export const signUpPagePath = () => "/sign-up";
export const signInPagePath = () => "/sign-in";
export const passwordForgotPagePath = () => "/password-forgot";

// account
export const accountProfilePagePath = () => "/account/profile";
export const accountPasswordPagePath = () => "/account/password";

// email verification
export const emailVerificationPagePath = () => "/email-verification";
