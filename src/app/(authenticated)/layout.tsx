import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import AiChatBot from "@/features/chat/components/AiChatBot";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

const AuthenticatedLayout = async ({ children }: AuthenticatedLayoutProps) => {
  const user = await getAuthOrRedirect();

  return (
    <>
      {children}
      {user && <AiChatBot />}
    </>
  );
};

export default AuthenticatedLayout;
