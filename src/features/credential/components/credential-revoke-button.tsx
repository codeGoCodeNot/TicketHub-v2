// credential-revoke-button.tsx
"use client";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { Button } from "@/components/ui/button";
import { LucideBan, LucideLoaderCircle } from "lucide-react";
import revokeCredential from "../actions/revoke-credential";

type CredentialRevokeButtonProps = {
  id: string;
  organizationId: string;
};

const CredentialRevokeButton = ({
  id,
  organizationId,
}: CredentialRevokeButtonProps) => {
  const [revokeButton, revokeDialog] = useConfirmDialog({
    action: revokeCredential.bind(null, organizationId, id),
    title: "Revoke Credential?",
    description:
      "This will immediately invalidate the API key. This cannot be undone.",
    trigger: (isPending) => (
      <Button variant="destructive" size="sm">
        {isPending ? (
          <LucideLoaderCircle className="animate-spin w-4 h-4" />
        ) : (
          <>
            <LucideBan className="w-4 h-4 mr-1" />
            Revoke
          </>
        )}
      </Button>
    ),
  });

  return (
    <>
      {revokeButton}
      {revokeDialog}
    </>
  );
};

export default CredentialRevokeButton;
