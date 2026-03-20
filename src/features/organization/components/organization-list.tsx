import { format } from "date-fns";
import getOrganizationsByUser from "../queries/get-organizations-by-user";

const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();

  return (
    <div>
      {organizations.map((org) => (
        <div key={org.id}>
          <div>Name: {org.organization.name ?? "Unnamed Organization"}</div>
          <div>
            Joined At:{" "}
            {format(org.membershipByUser.createdAt, "yyyy/MM/dd, HH:mm")}
          </div>
          <p className="text-muted-foreground">
            Role: {org.membershipByUser?.role ?? "No Role"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;
