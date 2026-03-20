"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const CreateDummyOrg = () => {
  return (
    <Button
      onClick={() =>
        authClient.organization.create({
          name: "Dummy Organization",
          slug: "dummy-organization-2",
        })
      }
    >
      Create Org
    </Button>
  );
};

export default CreateDummyOrg;
