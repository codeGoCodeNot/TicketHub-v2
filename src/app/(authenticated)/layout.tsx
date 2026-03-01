import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

const AuthenticatedLayout = async ({ children }: AuthenticatedLayoutProps) => {
  await getAuthOrRedirect();

  return <>{children}</>;
};

export default AuthenticatedLayout;
