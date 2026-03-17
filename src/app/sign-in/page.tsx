import CardCompact from "@/components/card-compact";
import SignInForm from "@/features/auth/components/sign-in-form";
import { signUpPagePath } from "@/path";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const SignInPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account to get started"
        className={`${inter.className} w-full max-w-[420px] animate-fade-from-top`}
        content={<SignInForm />}
        footer={
          <Link
            className="text-sm text-muted-foreground flex justify-center gap-x-1 w-full"
            href={signUpPagePath()}
          >
            <span> Don't have an account? </span>
            <span className="underline">Sign Up now</span>
          </Link>
        }
      />
    </div>
  );
};

export default SignInPage;
