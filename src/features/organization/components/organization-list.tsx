import getOrganizationsByUser from "../queries/get-organizations-by-user";

const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();

  return (
    <div>
      {organizations.map((org) => (
        <div key={org.id}>
          <div className="text-white">
            Name: {org.organization.name ?? "Unnamed Organization"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;
