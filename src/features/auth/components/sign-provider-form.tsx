"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ticketsPagePath } from "@/path";
import { useState } from "react";

const SignInProviderForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async (provider: "google") => {
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: ticketsPagePath(),
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-between gap-y-2 mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleGoogleSignIn("google")}
          disabled={loading}
        >
          {loading ? (
            <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full align-middle" />
          ) : (
            <GoogleIcon width="0.98em" height="1em" />
          )}
          {loading ? "Signing in..." : "Sign in with Google"}
        </Button>

        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default SignInProviderForm;
