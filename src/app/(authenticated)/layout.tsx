import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import AiChatBot from "@/features/chat/components/AiChatBot";
import getChatMessages from "@/features/chat/queries/get-chat-messages";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

const AuthenticatedLayout = async ({ children }: AuthenticatedLayoutProps) => {
  const user = await getAuthOrRedirect();
  const chatHistory = await getChatMessages();

  return (
    <>
      {children}
      {user && <AiChatBot initialMessages={chatHistory} userName={user.name} />}
    </>
  );
};

export default AuthenticatedLayout;
