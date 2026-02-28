import Heading from "@/components/heading";
import AccountTabs from "@/features/account/components/account-tabs";

const AccountProfilePage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <div className="flex flex-col gap-y-8 flex-1">
        <Heading
          title="Profile"
          description="All your account profile information"
          tabs={<AccountTabs />}
        />
        <h1 className="text-4xl text-center">Under construction</h1>
      </div>
    </div>
  );
};

export default AccountProfilePage;
