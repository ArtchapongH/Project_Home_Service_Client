import type {
  ApiListMeta,
  TechnicianJob,
  TechnicianListFilters,
} from "@/types/technician";
import { isJobWithinRadius } from "@/utils/technician";

const MOCK_DELAY_MS = 150;

const INITIAL_REQUESTS: TechnicianJob[] = [
  {
    orderId: "101",
    orderCode: "HS-2026-0101",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-22T03:00:00.000Z",
    address: "88/12 ถนนสุขุมวิท 71 เขตวัฒนา กรุงเทพมหานคร",
    serviceLatitude: 13.7317,
    serviceLongitude: 100.5842,
    subtotal: 900,
    discount: 0,
    totalPrice: 900,
    serviceId: "3",
    serviceName: "ซ่อมเครื่องซักผ้า",
    categoryName: "ซ่อมเครื่องใช้ไฟฟ้า",
    customerName: "กิตติพงษ์ ใจดี",
    customerPhone: "081-234-5678",
    items: [
      {
        itemId: "1001",
        optionId: "1101",
        optionName: "ตรวจเช็กและซ่อมเครื่องซักผ้าฝาบน",
        quantity: 1,
        unitPrice: 900,
        unit: "เครื่อง",
      },
    ],
  },
  {
    orderId: "102",
    orderCode: "HS-2026-0102",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-23T06:30:00.000Z",
    address: "45 ซอยลาดพร้าว 101 เขตบางกะปิ กรุงเทพมหานคร",
    serviceLatitude: 13.7791,
    serviceLongitude: 100.6356,
    subtotal: 1_200,
    discount: 100,
    totalPrice: 1_100,
    serviceId: "1",
    serviceName: "ทำความสะอาดทั่วไป",
    categoryName: "ทำความสะอาด",
    customerName: "ณัฐชา แสงทอง",
    customerPhone: "089-555-0142",
    items: [
      {
        itemId: "1002",
        optionId: "1201",
        optionName: "ทำความสะอาดคอนโด 1 ห้องนอน",
        quantity: 1,
        unitPrice: 1_200,
        unit: "ครั้ง",
      },
    ],
  },
  {
    orderId: "103",
    orderCode: "HS-2026-0103",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-24T02:00:00.000Z",
    address: "120/9 ถนนรัชดาภิเษก เขตดินแดง กรุงเทพมหานคร",
    serviceLatitude: 13.7663,
    serviceLongitude: 100.5695,
    subtotal: 1_500,
    discount: 0,
    totalPrice: 1_500,
    serviceId: "13",
    serviceName: "ทำลายข้าวของ",
    categoryName: "บริการห้องครัว",
    customerName: "พิมพ์ชนก มีสุข",
    customerPhone: "086-321-9012",
    items: [
      {
        itemId: "1003",
        optionId: "1301",
        optionName: "ขนย้ายของไม่ใช้แล้วขนาดกลาง",
        quantity: 1,
        unitPrice: 1_500,
        unit: "เที่ยว",
      },
    ],
  },
  {
    orderId: "104",
    orderCode: "HS-2026-0104",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-26T07:00:00.000Z",
    address: "19/4 ถนนนางลิ้นจี่ เขตสาทร กรุงเทพมหานคร",
    serviceLatitude: 13.7049,
    serviceLongitude: 100.5437,
    subtotal: 1_400,
    discount: 0,
    totalPrice: 1_400,
    serviceId: "2",
    serviceName: "ล้างแอร์",
    categoryName: "เครื่องปรับอากาศ",
    customerName: "ธนกฤต วัฒนากุล",
    customerPhone: "092-428-7755",
    items: [
      {
        itemId: "1004",
        optionId: "1401",
        optionName: "ล้างแอร์ติดผนัง 9,000–18,000 BTU",
        quantity: 2,
        unitPrice: 700,
        unit: "เครื่อง",
      },
    ],
  },
  {
    orderId: "105",
    orderCode: "HS-2026-0105",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-27T04:30:00.000Z",
    address: "99/1 ถนนพหลโยธิน เขตจตุจักร กรุงเทพมหานคร",
    serviceLatitude: 13.8285,
    serviceLongitude: 100.5596,
    subtotal: 650,
    discount: 0,
    totalPrice: 650,
    serviceId: "3",
    serviceName: "ซ่อมเครื่องซักผ้า",
    categoryName: "ซ่อมเครื่องใช้ไฟฟ้า",
    customerName: "วราภรณ์ บุญช่วย",
    customerPhone: "080-441-8282",
    items: [
      {
        itemId: "1005",
        optionId: "1102",
        optionName: "ตรวจเช็กเครื่องซักผ้าฝาหน้า",
        quantity: 1,
        unitPrice: 650,
        unit: "เครื่อง",
      },
    ],
  },
  {
    orderId: "106",
    orderCode: "HS-2026-0106",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-28T01:30:00.000Z",
    address: "72/18 ถนนเจริญกรุง เขตบางคอแหลม กรุงเทพมหานคร",
    serviceLatitude: 13.6944,
    serviceLongitude: 100.5028,
    subtotal: 1_800,
    discount: 200,
    totalPrice: 1_600,
    serviceId: "1",
    serviceName: "ทำความสะอาดทั่วไป",
    categoryName: "ทำความสะอาด",
    customerName: "ชลธิชา เกษมสุข",
    customerPhone: "095-716-3048",
    items: [
      {
        itemId: "1006",
        optionId: "1202",
        optionName: "ทำความสะอาดบ้าน 2 ชั้น",
        quantity: 1,
        unitPrice: 1_800,
        unit: "ครั้ง",
      },
    ],
  },
  {
    orderId: "107",
    orderCode: "HS-2026-0107",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-29T02:00:00.000Z",
    address: "15/8 ถนนนิมมานเหมินท์ ตำบลสุเทพ อำเภอเมือง เชียงใหม่",
    serviceLatitude: 18.7964,
    serviceLongitude: 98.9673,
    subtotal: 1_250,
    discount: 0,
    totalPrice: 1_250,
    serviceId: "4",
    serviceName: "ติดตั้งพัดลมเพดาน",
    categoryName: "งานไฟฟ้า",
    customerName: "อนุชา ใจเย็น",
    customerPhone: "081-902-4471",
    items: [
      {
        itemId: "1007",
        optionId: "1501",
        optionName: "ติดตั้งพัดลมเพดานห้องนั่งเล่น",
        quantity: 2,
        unitPrice: 625,
        unit: "ตัว",
      },
    ],
  },
  {
    orderId: "108",
    orderCode: "HS-2026-0108",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-30T05:00:00.000Z",
    address: "322 ถนนศรีจันทร์ ตำบลในเมือง อำเภอเมือง ขอนแก่น",
    serviceLatitude: 16.4322,
    serviceLongitude: 102.8236,
    subtotal: 2_200,
    discount: 200,
    totalPrice: 2_000,
    serviceId: "5",
    serviceName: "ซ่อมท่อประปา",
    categoryName: "งานประปา",
    customerName: "ศิริพร ทองดี",
    customerPhone: "088-214-6390",
    items: [
      {
        itemId: "1008",
        optionId: "1601",
        optionName: "ซ่อมท่อน้ำรั่วภายในบ้าน",
        quantity: 1,
        unitPrice: 2_200,
        unit: "จุด",
      },
    ],
  },
  {
    orderId: "109",
    orderCode: "HS-2026-0109",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-08-31T08:00:00.000Z",
    address: "88 ถนนราษฎร์อุทิศ ตำบลป่าตอง อำเภอกะทู้ ภูเก็ต",
    serviceLatitude: 7.8965,
    serviceLongitude: 98.2965,
    subtotal: 1_800,
    discount: 0,
    totalPrice: 1_800,
    serviceId: "6",
    serviceName: "กำจัดปลวก",
    categoryName: "กำจัดแมลง",
    customerName: "ภาณุพงศ์ ทะเลทอง",
    customerPhone: "076-441-2288",
    items: [
      {
        itemId: "1009",
        optionId: "1701",
        optionName: "กำจัดปลวกบ้านพัก 1 ชั้น",
        quantity: 1,
        unitPrice: 1_800,
        unit: "หลัง",
      },
    ],
  },
  {
    orderId: "110",
    orderCode: "HS-2026-0110",
    orderStatus: "PENDING_TECHNICIAN",
    scheduledAt: "2026-09-01T03:30:00.000Z",
    address: "209/15 ถนนพัทยาสายสอง ตำบลหนองปรือ อำเภอบางละมุง ชลบุรี",
    serviceLatitude: 12.9276,
    serviceLongitude: 100.8771,
    subtotal: 950,
    discount: 0,
    totalPrice: 950,
    serviceId: "7",
    serviceName: "ซ่อมประตูรั้ว",
    categoryName: "งานช่างทั่วไป",
    customerName: "มินตรา สุขใจ",
    customerPhone: "038-725-4410",
    items: [
      {
        itemId: "1010",
        optionId: "1801",
        optionName: "ซ่อมบานประตูรั้วเหล็ก",
        quantity: 1,
        unitPrice: 950,
        unit: "บาน",
      },
    ],
  },
];

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

export function resetTechnicianMockStore(): void {
  availableRequests = structuredClone(INITIAL_REQUESTS);
  acceptedJobs = [];
}
