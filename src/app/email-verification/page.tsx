import Heading from "@/components/heading";
import getAuth from "@/features/auth/actions/get-auth";
import { LucideMail } from "lucide-react";

const EmailVerificationPage = async () => {
  const user = await getAuth();

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading
        title="Email Verification Page"
        description="Please check your email to verify your account."
      />

      <div className="px-8">
        <p className="text-muted-foreground flex items-center gap-x-1">
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
