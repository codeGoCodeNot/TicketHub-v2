import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import AccountTabs from "@/features/account/components/account-tabs";
import PasswordChangeForm from "@/features/password/components/password-change-form";

const AccountPasswordPage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading
        title="Password"
        description="Update your account password"
        tabs={<AccountTabs />}
      />

      <div className="flex-1 flex flex-col items-center">
        <CardCompact
          title="Change Password"
          description="Enter your current password"
          className="w-full max-w-[420px] animate-fade-from-top"
          content={<PasswordChangeForm />}
        />
      </div>
    </div>
  );
};

export default AccountPasswordPage;
