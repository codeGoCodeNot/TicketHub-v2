export const homePagePath = () => "/";

export const ticketsPagePath = () => "/tickets";
export const ticketPagePath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPagePath = (ticketId: string) =>
  `/tickets/${ticketId}/edit`;

export const signUpPagePath = () => "/sign-up";
export const signInPagePath = () => "/sign-in";
export const passwordForgotPagePath = () => "/password-forgot";
