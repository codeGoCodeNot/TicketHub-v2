import { format } from "date-fns";
import getOrganizationsByUser from "../queries/get-organizations-by-user";

const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();

  return (
    <div>
      {organizations.map(({ organization, membershipByUser }) => (
        <div key={organization.id}>
          <div>Name: {organization.name ?? "Unnamed Organization"}</div>
          <div>
            Joined At: {format(membershipByUser.createdAt, "yyyy/MM/dd, HH:mm")}
          </div>
          <div>Members: {organization._count.members}</div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;
