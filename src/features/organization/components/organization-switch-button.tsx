"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LucideArrowLeftRight, LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type OrganizationSwitchButtonProps = {
  organizationId: string;
  isActive?: boolean;
};

const OrganizationSwitchButton = ({
  organizationId,
  isActive,
}: OrganizationSwitchButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    setLoading(true);
    const { error } = await authClient.organization.setActive({
      organizationId,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Switched organization successfully");
    router.refresh();
  };

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      disabled={loading}
      onClick={handleSwitch}
    >
      {loading ? (
        <LucideLoaderCircle className="animate-spin" />
      ) : (
        <LucideArrowLeftRight />
      )}
    </Button>
  );
};

export default OrganizationSwitchButton;
