import CardCompact from "@/components/card-compact";
import PasswordResetForm from "@/features/password/components/password-reset-form";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type PasswordResetPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

const PasswordResetPage = async ({ searchParams }: PasswordResetPageProps) => {
  const { token } = await searchParams;

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Reset Password"
        description="Enter your new password to reset your account password"
        className={`${inter.className} w-full max-w-[420px] animate-fade-from-top`}
        content={<PasswordResetForm token={token ?? ""} />}
      />
    </div>
  );
};

export default PasswordResetPage;
