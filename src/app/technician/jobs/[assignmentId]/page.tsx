import { TechnicianJobDetail } from "@/components/technician/jobs/TechnicianJobDetail";

export default async function TechnicianJobPage({ params }: PageProps<"/technician/jobs/[assignmentId]">) {
  const { assignmentId } = await params;
  return <TechnicianJobDetail assignmentId={assignmentId} />;
}
