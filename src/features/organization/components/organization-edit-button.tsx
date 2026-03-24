"use client";
import ToolTip from "@/components/tool-tip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { LucideLoaderCircle, LucidePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type OrganizationEditButtonProps = {
  organizationId: string;
  currentName: string;
};

const OrganizationEditButton = ({
  organizationId,
  currentName,
}: OrganizationEditButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.organization.update({
        organizationId,
        data: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      });

      if (error) {
        toast.error(error.message || "Failed to update organization");
        return;
      }
    },
    onSuccess: () => {
      toast.success("Organization updated successfully");
      setOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update organization");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ToolTip label="Edit organization">
          <Button variant="outline" size="icon">
            <LucidePen />
          </Button>
        </ToolTip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization name"
          />
          <Button onClick={() => mutate()} disabled={isPending}>
            {isPending ? (
              <span className="flex gap-x-1">
                <LucideLoaderCircle className="animate-spin" /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationEditButton;
