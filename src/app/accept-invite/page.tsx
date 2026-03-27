import AcceptInviteCard from "@/features/accept-invite/components/accept-invite-card";
import { auth } from "@/lib/auth";
import { homePagePath, signInPagePath } from "@/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type AcceptInvitePageProps = {
  searchParams: Promise<{ token: string }>;
};

const AcceptInvitePage = async ({ searchParams }: AcceptInvitePageProps) => {
  const { token } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    redirect(`${signInPagePath()}?callbackUrl=/accept-invite?token=${token}`);

  if (!token) redirect(homePagePath());

  const invitation = await auth.api.getInvitation({
    headers: await headers(),
    query: { id: token },
  });

  if (!invitation) redirect(homePagePath());

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AcceptInviteCard invitation={invitation} token={token} />
    </div>
  );
};

export default AcceptInvitePage;
