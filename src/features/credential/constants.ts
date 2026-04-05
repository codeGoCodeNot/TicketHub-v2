export const CREDENTIAL_SCOPES = {
  DELETE_TICKET: "delete:ticket",
  READ_TICKET: "read:ticket",
};

export type CredentialScope =
  (typeof CREDENTIAL_SCOPES)[keyof typeof CREDENTIAL_SCOPES];

export const DEFAULT_CREDENTIAL_SCOPES: CredentialScope[] = [
  CREDENTIAL_SCOPES.DELETE_TICKET,
];

export const scopesToString = (scopes: CredentialScope[]): string => {
  return scopes.join(",");
};

export const stringToScopes = (scopesString: string): CredentialScope[] => {
  return scopesString.split(",") as CredentialScope[];
};

export const hasScope = (
  scopes: string,
  CredentialScope: CredentialScope,
): boolean => {
  return stringToScopes(scopes).includes(CredentialScope);
};
