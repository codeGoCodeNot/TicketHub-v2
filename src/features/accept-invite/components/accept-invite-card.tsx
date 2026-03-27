"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { homePagePath } from "@/path";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AcceptInviteCardProps = {
  invitation: {
    id: string;
    email: string;
    organizationName: string;
    inviterEmail: string;
  };
  token: string;
};

const AcceptInviteCard = ({ invitation, token }: AcceptInviteCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    const result = await authClient.organization.acceptInvitation({
      invitationId: token,
    });
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success("Invitation accepted successfully.");
      router.push(homePagePath());
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    const result = await authClient.organization.rejectInvitation({
      invitationId: token,
    });
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success("Invitation rejected.");
      router.push(homePagePath());
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle>Organization Invitation</CardTitle>
        <CardDescription>
          You have been invited to join {invitation.organizationName} by{" "}
          {invitation.inviterEmail}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Accepting this invitation will add you as a member of{" "}
          <span className="font-semibold">{invitation.organizationName}</span>.
        </p>
      </CardContent>
      <CardFooter className="flex gap-x-2 justify-end">
        <Button variant="outline" onClick={handleReject} disabled={isLoading}>
          Decline
        </Button>
        <Button onClick={handleAccept} disabled={isLoading}>
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AcceptInviteCard;
