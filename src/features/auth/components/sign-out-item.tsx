"use client";

import { authClient } from "@/lib/auth-client";
import { signInPagePath } from "@/path";
import { LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignOutItem = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await authClient.signOut();
    setLoading(false);

    if (error) {
      return toast.error(
        error.message || "Failed to sign out. Please try again.",
      );
    } else {
      toast.success("Signed out successfully.");
      router.push(signInPagePath());
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-x-2"
    >
      {loading ? (
        <>
          <span>Sign Out</span>
          <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full align-middle" />
        </>
      ) : (
        <>
          <span>Sign Out</span>
          <LucideLogOut />
        </>
      )}
    </button>
  );
};

export default SignOutItem;
