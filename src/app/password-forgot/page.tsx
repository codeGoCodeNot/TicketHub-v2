import CardCompact from "@/components/card-compact";
import PasswordForgotForm from "@/features/password/components/password-forgot-form";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const PasswordForgotPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Forgot Password"
        description="Enter your email to reset your password"
        className={`${inter.className} w-full max-w-[420px] animate-fade-from-top`}
        content={<PasswordForgotForm />}
      />
    </div>
  );
};

export default PasswordForgotPage;
