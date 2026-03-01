import Heading from "@/components/heading";
import AccountTabs from "@/features/account/components/account-tabs";

const AccountPasswordPage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading
        title="Password"
        description="Update your account password"
        tabs={<AccountTabs />}
      />
      <h1 className="text-4xl text-center">Under construction</h1>
    </div>
  );
};

export default AccountPasswordPage;
