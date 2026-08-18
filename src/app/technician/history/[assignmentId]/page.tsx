import { TechnicianJobDetail } from "@/components/technician/jobs/TechnicianJobDetail";

export default async function TechnicianHistoryDetailPage({ params }: PageProps<"/technician/history/[assignmentId]">) {
  const { assignmentId } = await params;
  return <TechnicianJobDetail assignmentId={assignmentId} history />;
}
