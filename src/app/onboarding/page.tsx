import CardCompact from "@/components/card-compact";
import OrganizationCreateForm from "@/features/onboarding/components/organization-create-form";

const OnboardPagePath = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <CardCompact
        title="Create Organization"
        description="Create an organization to get started"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<OrganizationCreateForm />}
      />
    </div>
  );
};

export default OnboardPagePath;
