"use client";

import { authClient } from "@/lib/auth-client";
import { signInPagePath } from "@/path";
import { useQueryClient } from "@tanstack/react-query";

import { LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignOutItem = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await authClient.signOut();
    setLoading(false);

    if (error) {
      return toast.error("Failed to log out. Please try again.");
    } else {
      queryClient.removeQueries({ queryKey: ["user"] });
      toast.success("Logged out successfully.");
      router.push(signInPagePath());
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-x-2 w-full"
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
