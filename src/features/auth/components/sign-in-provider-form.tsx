"use client";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ticketsPagePath } from "@/path";
import { useState } from "react";

const SignInProviderForm = () => {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError(null);
    setLoadingProvider(provider);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: ticketsPagePath(),
    });

    setLoadingProvider(null);

    if (error) {
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="mt-2 flex w-full flex-col gap-1">
      <div className="w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignIn("google")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full align-middle" />
          ) : (
            <GoogleIcon width="0.98em" height="1em" />
          )}
          {loadingProvider === "google"
            ? "Signing in..."
            : "Sign in with Google"}
        </Button>
        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignIn("github")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "github" ? (
            <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full align-middle" />
          ) : (
            <GitHubIcon width="0.98em" height="1em" />
          )}
          {loadingProvider === "github"
            ? "Signing in..."
            : "Sign in with GitHub"}
        </Button>

        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInProviderForm;
