import { auth } from "@/lib/auth";
import { homePagePath, signInPagePath } from "@/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type AcceptInvitePageProps = {
  searchParams: Promise<{ token: string }>;
};

const AcceptInvitePage = async ({ searchParams }: AcceptInvitePageProps) => {
  const { token } = await searchParams;

  if (!token) redirect(homePagePath());

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    redirect(`${signInPagePath()}?callbackUrl=/accept-invite?token=${token}`);

  try {
    await auth.api.acceptInvitation({
      headers: await headers(),
      body: {
        invitationId: token,
      },
    });
  } catch (error) {
    redirect(`${homePagePath()}?error=Failed to accept invite`);
  }

  redirect(homePagePath());
};

export default AcceptInvitePage;
