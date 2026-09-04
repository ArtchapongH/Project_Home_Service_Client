import { TechnicianJobDetail } from "@/components/technician/jobs/TechnicianJobDetail";

export default async function TechnicianHistoryDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  return (
    <TechnicianJobDetail
      key={assignmentId}
      assignmentId={assignmentId}
      history
    />
  );
}
