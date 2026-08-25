import { beforeEach, describe, expect, it } from "vitest";
import {
  acceptMockTechnicianRequest,
  declineMockTechnicianRequest,
  getMockTechnicianJob,
  getMockTechnicianJobs,
  getMockTechnicianRequests,
  resetTechnicianMockStore,
} from "@/mocks/technicianRequests";

describe("technician request mock store", () => {
  beforeEach(() => {
    resetTechnicianMockStore();
  });

  it("filters requests by order code, service name, and service id", async () => {
    const byCode = await getMockTechnicianRequests({ search: "0102" });
    const byServiceName = await getMockTechnicianRequests({ search: "ทำความสะอาด" });
    const byServiceId = await getMockTechnicianRequests({ serviceId: "2" });
    const combined = await getMockTechnicianRequests({
      serviceId: "3",
      search: "0105",
    });

    expect(byCode.data.map((job) => job.orderCode)).toEqual(["HS-2026-0102"]);
    expect(byServiceName.data).toHaveLength(2);
    expect(byServiceId.data.map((job) => job.serviceName)).toEqual(["ล้างแอร์"]);
    expect(combined.data.map((job) => job.orderId)).toEqual(["105"]);
  });

  it("moves an accepted request to jobs and exposes its detail", async () => {
    const accepted = await acceptMockTechnicianRequest("101");
    const requests = await getMockTechnicianRequests();
    const jobs = await getMockTechnicianJobs();
    const detail = await getMockTechnicianJob(accepted.assignmentId ?? "");

    expect(requests.meta.total).toBe(9);
    expect(requests.data.some((job) => job.orderId === "101")).toBe(false);
    expect(accepted).toMatchObject({
      assignmentId: "MOCK-ASG-101",
      assignmentStatus: "ACCEPTED",
      orderStatus: "ACCEPTED",
    });
    expect(jobs.data.map((job) => job.orderId)).toEqual(["101"]);
    expect(detail.orderCode).toBe("HS-2026-0101");
  });

  it("rejects a duplicate acceptance with ORDER_ALREADY_ASSIGNED", async () => {
    await acceptMockTechnicianRequest("101");

    await expect(acceptMockTechnicianRequest("101")).rejects.toMatchObject({
      code: "ORDER_ALREADY_ASSIGNED",
    });
  });

  it("removes a declined request without creating a job", async () => {
    await declineMockTechnicianRequest("102");

    const requests = await getMockTechnicianRequests();
    const jobs = await getMockTechnicianJobs();
    expect(requests.data.some((job) => job.orderId === "102")).toBe(false);
    expect(jobs.data).toHaveLength(0);
  });

  it("restores initial requests when the store resets", async () => {
    await acceptMockTechnicianRequest("101");
    resetTechnicianMockStore();

    const requests = await getMockTechnicianRequests();
    const jobs = await getMockTechnicianJobs();
    expect(requests.meta.total).toBe(10);
    expect(jobs.meta.total).toBe(0);
  });

  it("keeps only jobs within 4km of the technician", async () => {
    const nearby = await getMockTechnicianRequests({
      latitude: 13.8285,
      longitude: 100.5596,
    });
    const farAway = await getMockTechnicianRequests({
      latitude: 18.7964,
      longitude: 98.9673,
    });

    expect(nearby.data.map((job) => job.orderId)).toEqual(["105"]);
    expect(farAway.data.map((job) => job.orderId)).toEqual(["107"]);
  });
});
