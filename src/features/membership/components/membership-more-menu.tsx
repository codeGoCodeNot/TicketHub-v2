"use client";

import ToolTip from "@/components/tool-tip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { LucideUserCog } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MembershipMoreMenuProps = {
  memberRole: string;
  organizationId: string;
  memberId: string;
};

const MembershipMoreMenu = ({
  memberRole,
  organizationId,
  memberId,
}: MembershipMoreMenuProps) => {
  const router = useRouter();

  const handleUpdateMemberRole = async (value: string) => {
    const { error } = await authClient.organization.updateMemberRole({
      organizationId,
      memberId,
      role: value as "admin" | "member" | "owner",
    });

    if (error) {
      toast.error(error.message || "Failed to update member role");
      return;
    }
    toast.success("Member role updated successfully");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <ToolTip label="Manage member role">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <LucideUserCog />
          </Button>
        </DropdownMenuTrigger>
      </ToolTip>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Roles</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup
          value={memberRole}
          onValueChange={handleUpdateMemberRole}
        >
          <DropdownMenuRadioItem value="owner">Owner</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MembershipMoreMenu;
