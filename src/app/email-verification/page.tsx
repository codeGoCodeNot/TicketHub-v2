import Heading from "@/components/heading";
import getAuth from "@/lib/get-auth";

const EmailVerificationPage = async () => {
  const user = await getAuth();

  return (
    <div className="flex flex-col gap-y-8 flex-1 items-center px-2 sm:px-0">
      <Heading
        title="Email Verification"
        description="Please check your email to verify your account."
      />

      <div className="w-full max-w-md bg-card/50 rounded-lg p-4 sm:p-8">
        <p className="text-muted-foreground flex flex-wrap items-center gap-x-1 text-center justify-center">
          A verification email has been sent to{" "}
          <span className="text-foreground flex items-center gap-x-1 font-semibold">
            {user?.email}
          </span>
          . Please check your inbox and click on the verification link to verify
          your email address.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
