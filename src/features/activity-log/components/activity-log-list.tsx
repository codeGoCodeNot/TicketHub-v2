import getActivityLogs from "../queries/get-activity-log";
import ActivityLogs from "./activity-logs";

type ActivityLogListProps = {
  organizationId: string;
};

const ActivityLogList = async ({ organizationId }: ActivityLogListProps) => {
  const initialData = await getActivityLogs(organizationId);

  return (
    <ActivityLogs organizationId={organizationId} initialData={initialData} />
  );
};

export default ActivityLogList;
