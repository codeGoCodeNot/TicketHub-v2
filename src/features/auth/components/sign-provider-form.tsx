"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const SignInProviderForm = () => {
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-between gap-y-2 mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon width="0.98em" height="1em" />
          Sign in with Google
        </Button>
      </div>
    </>
  );
};

export default SignInProviderForm;
