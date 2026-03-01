import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import AccountTabs from "@/features/account/components/account-tabs";
import UpdateProfileForm from "@/features/account/components/update-profile-form";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";

const AccountProfilePage = async () => {
  const user = await getAuthOrRedirect();

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <div className="flex flex-col gap-y-8 flex-1">
        <Heading
          title="Profile"
          description="All your account profile information"
          tabs={<AccountTabs />}
        />
        <div className="flex-1 flex flex-col justify-center items-center">
          <CardCompact
            title="Profile Details"
            description="View and update your profile information"
            className="w-full max-w-[420px] animate-fade-from-top"
            content={
              <UpdateProfileForm
                username={user.name}
                email={user.email}
                image={user.image}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AccountProfilePage;
