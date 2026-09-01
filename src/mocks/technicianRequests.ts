import type {
  ApiListMeta,
  TechnicianJob,
  TechnicianListFilters,
} from "@/types/technician";
import { INITIAL_REQUESTS } from "@/mocks/technicianRequestFixtures";
import { isJobWithinRadius } from "@/utils/technician";

const MOCK_DELAY_MS = 150;

export class TechnicianMockError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "TechnicianMockError";
    this.code = code;
  }
}

let availableRequests = structuredClone(INITIAL_REQUESTS);
let acceptedJobs: TechnicianJob[] = [];

function waitForMock(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
}

function matchesSearch(job: TechnicianJob, search?: string): boolean {
  const normalizedSearch = search?.trim().toLocaleLowerCase("th-TH");
  if (!normalizedSearch) return true;

  return [job.orderCode, job.serviceName].some((value) =>
    value.toLocaleLowerCase("th-TH").includes(normalizedSearch),
  );
}

function filterJobs(
  jobs: TechnicianJob[],
  filters: TechnicianListFilters,
): TechnicianJob[] {
  return jobs.filter((job) => {
    if (filters.serviceId && job.serviceId !== filters.serviceId) return false;
    if (filters.status && job.assignmentStatus !== filters.status) return false;
    if (
      filters.latitude !== undefined &&
      filters.longitude !== undefined &&
      !isJobWithinRadius(
        filters.latitude,
        filters.longitude,
        job.serviceLatitude,
        job.serviceLongitude,
      )
    ) {
      return false;
    }
    return matchesSearch(job, filters.search);
  });
}

function sortJobs(
  jobs: TechnicianJob[],
  sort: TechnicianListFilters["sort"],
): TechnicianJob[] {
  if (!sort) return jobs;

  return [...jobs].sort((left, right) => {
    if (sort === "nearest") {
      const leftSchedule = left.scheduledAt
        ? new Date(left.scheduledAt).getTime()
        : Number.POSITIVE_INFINITY;
      const rightSchedule = right.scheduledAt
        ? new Date(right.scheduledAt).getTime()
        : Number.POSITIVE_INFINITY;
      return leftSchedule - rightSchedule;
    }

    const leftAssignedAt = left.assignedAt
      ? new Date(left.assignedAt).getTime()
      : 0;
    const rightAssignedAt = right.assignedAt
      ? new Date(right.assignedAt).getTime()
      : 0;
    return sort === "oldest"
      ? leftAssignedAt - rightAssignedAt
      : rightAssignedAt - leftAssignedAt;
  });
}

export async function getMockTechnicianRequests(
  filters: TechnicianListFilters = {},
): Promise<{ data: TechnicianJob[]; meta: ApiListMeta }> {
  await waitForMock();
  const data = filterJobs(availableRequests, filters);
  return {
    data: structuredClone(data),
    meta: { total: data.length, isAvailable: true },
  };
}

export async function acceptMockTechnicianRequest(
  orderId: string,
): Promise<TechnicianJob> {
  await waitForMock();

  if (acceptedJobs.some((job) => job.orderId === orderId)) {
    throw new TechnicianMockError(
      "ORDER_ALREADY_ASSIGNED",
      "คำขอบริการนี้มีช่างรับงานแล้ว",
    );
  }

  const requestIndex = availableRequests.findIndex(
    (job) => job.orderId === orderId,
  );
  if (requestIndex === -1) {
    throw new TechnicianMockError("ORDER_NOT_FOUND", "ไม่พบคำขอบริการ");
  }

  const [request] = availableRequests.splice(requestIndex, 1);
  const acceptedAt = new Date().toISOString();
  const acceptedJob: TechnicianJob = {
    ...request,
    assignmentId: `MOCK-ASG-${request.orderId}`,
    assignmentStatus: "ACCEPTED",
    assignedAt: acceptedAt,
    completedAt: null,
    orderStatus: "ACCEPTED",
  };
  acceptedJobs.unshift(acceptedJob);
  return structuredClone(acceptedJob);
}

export async function declineMockTechnicianRequest(
  orderId: string,
): Promise<void> {
  await waitForMock();
  const requestIndex = availableRequests.findIndex(
    (job) => job.orderId === orderId,
  );
  if (requestIndex === -1) {
    throw new TechnicianMockError("ORDER_NOT_FOUND", "ไม่พบคำขอบริการ");
  }
  availableRequests.splice(requestIndex, 1);
}

export async function getMockTechnicianJobs(
  filters: TechnicianListFilters = {},
): Promise<{ data: TechnicianJob[]; meta: ApiListMeta }> {
  await waitForMock();
  const filteredJobs = filterJobs(acceptedJobs, filters);
  const data = sortJobs(filteredJobs, filters.sort);
  return { data: structuredClone(data), meta: { total: data.length } };
}

export async function getMockTechnicianJob(
  assignmentId: string,
): Promise<TechnicianJob> {
  await waitForMock();
  const job = acceptedJobs.find((item) => item.assignmentId === assignmentId);
  if (!job)
    throw new TechnicianMockError("JOB_NOT_FOUND", "ไม่พบงานที่ต้องการ");
  return structuredClone(job);
}

export async function completeMockTechnicianJob(
  assignmentId: string,
): Promise<TechnicianJob> {
  await waitForMock();
  const job = acceptedJobs.find((item) => item.assignmentId === assignmentId);
  if (!job) {
    throw new TechnicianMockError("JOB_NOT_FOUND", "ไม่พบงานที่ต้องการ");
  }

  job.assignmentStatus = "COMPLETED";
  job.orderStatus = "completed";
  job.completedAt = new Date().toISOString();
  return structuredClone(job);
}

export function resetTechnicianMockStore(): void {
  availableRequests = structuredClone(INITIAL_REQUESTS);
  acceptedJobs = [];
}
