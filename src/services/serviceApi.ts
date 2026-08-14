import {
  ServiceItem,
  CreateServiceInput,
  UpdateServiceInput,
} from "../types/service";

const STORAGE_KEY = "home_services_admin_data_v1";

export const mockClientServices: ServiceItem[] = [
  {
    id: "1",
    slug: "air-conditioner-cleaning",
    category: "บริการทั่วไป",
    name: "ล้างแอร์",
    price: "ค่าบริการประมาณ 500.00 - 1,000.00 ฿",
    minPrice: 500,
    maxPrice: 1000,
    image: "/images/landing/service-aircon.png",
    imageUrl: "/images/landing/service-aircon.png",
    isRecommended: true,
    popularityScore: 99,
  },
  {
    id: "2",
    slug: "air-conditioner-installation",
    category: "บริการทั่วไป",
    name: "ติดตั้งแอร์",
    price: "ค่าบริการประมาณ 2,800.00 ฿",
    minPrice: 2800,
    image: "/images/services/aircon-install.jpg",
    imageUrl: "/images/services/aircon-install.jpg",
    isRecommended: true,
    popularityScore: 95,
  },
  {
    id: "3",
    slug: "air-conditioner-repair",
    category: "บริการทั่วไป",
    name: "ซ่อมแอร์",
    price: "ค่าบริการประมาณ 400.00 ฿",
    minPrice: 400,
    image: "/images/services/aircon-repair.jpg",
    imageUrl: "/images/services/aircon-repair.jpg",
    isRecommended: false,
    popularityScore: 88,
  },
  {
    id: "4",
    slug: "general-cleaning",
    category: "บริการทั่วไป",
    name: "ทำความสะอาดทั่วไป",
    price: "ค่าบริการประมาณ 500.00 ฿",
    minPrice: 500,
    image: "/images/landing/service-cleaning.png",
    imageUrl: "/images/landing/service-cleaning.png",
    isRecommended: true,
    popularityScore: 97,
  },
  {
    id: "5",
    slug: "washing-machine-repair",
    category: "บริการทั่วไป",
    name: "ซ่อมเครื่องซักผ้า",
    price: "ค่าบริการประมาณ 500.00 ฿",
    minPrice: 500,
    image: "/images/landing/service-washing-machine.png",
    imageUrl: "/images/landing/service-washing-machine.png",
    isRecommended: false,
    popularityScore: 85,
  },
  {
    id: "6",
    slug: "gas-stove-installation",
    category: "บริการห้องครัว",
    name: "ติดตั้งเตาแก๊ส",
    price: "ค่าบริการประมาณ 1,000.00 ฿",
    minPrice: 1000,
    image: "/images/services/gas-stove.jpg",
    imageUrl: "/images/services/gas-stove.jpg",
    isRecommended: false,
    popularityScore: 78,
  },
  {
    id: "7",
    slug: "cooker-hood-installation",
    category: "บริการห้องครัว",
    name: "ติดตั้งเครื่องดูดควัน",
    price: "ค่าบริการประมาณ 1,000.00 ฿",
    minPrice: 1000,
    image: "/images/services/hood-install.jpg",
    imageUrl: "/images/services/hood-install.jpg",
    isRecommended: false,
    popularityScore: 82,
  },
  {
    id: "8",
    slug: "toilet-installation",
    category: "บริการห้องน้ำ",
    name: "ติดตั้งชักโครก",
    price: "ค่าบริการประมาณ 1,000.00 ฿",
    minPrice: 1000,
    image: "/images/services/toilet-install.jpg",
    imageUrl: "/images/services/toilet-install.jpg",
    isRecommended: false,
    popularityScore: 80,
  },
  {
    id: "9",
    slug: "water-heater-installation",
    category: "บริการห้องน้ำ",
    name: "ติดตั้งเครื่องทำน้ำอุ่น",
    price: "ค่าบริการประมาณ 500.00 ฿",
    minPrice: 500,
    image: "/images/services/water-heater.jpg",
    imageUrl: "/images/services/water-heater.jpg",
    isRecommended: false,
    popularityScore: 84,
  },
];

export async function fetchServices(): Promise<ServiceItem[]> {
  return Promise.resolve(mockClientServices);
}

const INITIAL_MOCK_SERVICES: ServiceItem[] = [
  {
    id: "serv-001",
    name: "ล้างแอร์",
    category: "บริการทั่วไป",
    imageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    serviceOptions: [
      {
        id: "sub-101",
        option_id: "sub-101",
        name: "9,000 - 18,000 BTU, แบบติดผนัง",
        option_name: "9,000 - 18,000 BTU, แบบติดผนัง",
        price: 500,
        unit: "เครื่อง",
      },
      {
        id: "sub-102",
        option_id: "sub-102",
        name: "18,001 - 24,000 BTU, แบบติดผนัง",
        option_name: "18,001 - 24,000 BTU, แบบติดผนัง",
        price: 600,
        unit: "เครื่อง",
      },
      {
        id: "sub-103",
        option_id: "sub-103",
        name: "24,001 - 30,000 BTU, แบบติดผนัง",
        option_name: "24,001 - 30,000 BTU, แบบติดผนัง",
        price: 800,
        unit: "เครื่อง",
      },
    ],
    createdAt: "15/01/2023 10:30 AM",
    updatedAt: "15/01/2023 10:30 AM",
  },
  {
    id: "serv-002",
    name: "ทำความสะอาดทั่วไป",
    category: "บริการทั่วไป",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    serviceOptions: [
      {
        id: "sub-201",
        option_id: "sub-201",
        name: "ทำความสะอาดบ้าน/คอนโด ขนาด 40-60 ตร.ม.",
        option_name: "ทำความสะอาดบ้าน/คอนโด ขนาด 40-60 ตร.ม.",
        price: 550,
        unit: "ครั้ง",
      },
      {
        id: "sub-202",
        option_id: "sub-202",
        name: "ทำความสะอาดบ้าน/คอนโด ขนาด 61-100 ตร.ม.",
        option_name: "ทำความสะอาดบ้าน/คอนโด ขนาด 61-100 ตร.ม.",
        price: 850,
        unit: "ครั้ง",
      },
    ],
    createdAt: "14/01/2023 09:15 AM",
    updatedAt: "14/01/2023 09:15 AM",
  },
  {
    id: "serv-003",
    name: "ล้างเครื่องซักผ้า",
    category: "บริการทั่วไป",
    imageUrl:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
    serviceOptions: [
      {
        id: "sub-301",
        option_id: "sub-301",
        name: "เครื่องซักผ้าฝาบน",
        option_name: "เครื่องซักผ้าฝาบน",
        price: 500,
        unit: "เครื่อง",
      },
      {
        id: "sub-302",
        option_id: "sub-302",
        name: "เครื่องซักผ้าฝาหน้า",
        option_name: "เครื่องซักผ้าฝาหน้า",
        price: 700,
        unit: "เครื่อง",
      },
    ],
    createdAt: "12/01/2023 02:40 PM",
    updatedAt: "12/01/2023 02:40 PM",
  },
  {
    id: "serv-004",
    name: "ซ่อมเครื่องปรับอากาศ",
    category: "บริการทั่วไป",
    imageUrl:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
    serviceOptions: [
      {
        id: "sub-401",
        option_id: "sub-401",
        name: "เช็คระยะ / ตรวจเช็คอาการเสีย",
        option_name: "เช็คระยะ / ตรวจเช็คอาการเสีย",
        price: 300,
        unit: "ครั้ง",
      },
      {
        id: "sub-402",
        option_id: "sub-402",
        name: "เติมน้ำยาแอร์ R32 / R410A",
        option_name: "เติมน้ำยาแอร์ R32 / R410A",
        price: 450,
        unit: "ปอนด์",
      },
    ],
    createdAt: "10/01/2023 11:20 AM",
    updatedAt: "10/01/2023 11:20 AM",
  },
];

function getStoredServices(): ServiceItem[] {
  if (typeof window === "undefined") return INITIAL_MOCK_SERVICES;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SERVICES));
      return INITIAL_MOCK_SERVICES;
    }
    const parsed: ServiceItem[] = JSON.parse(data);
    return parsed.map((item) => ({
      ...item,
      serviceOptions: item.serviceOptions || [],
    }));
  } catch (e) {
    console.error("Error reading services from localStorage:", e);
    return INITIAL_MOCK_SERVICES;
  }
}

function saveStoredServices(services: ServiceItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  } catch (e) {
    console.error("Error saving services to localStorage:", e);
  }
}

function formatCurrentDateTime(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");
  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}

export const serviceApi = {
  async getServices(searchQuery: string = ""): Promise<ServiceItem[]> {
    const services = getStoredServices();
    if (!searchQuery.trim()) return services;

    const query = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );
  },

  async getServiceById(id: string): Promise<ServiceItem | null> {
    const services = getStoredServices();
    const service = services.find((s) => String(s.id) === String(id));
    if (!service) return null;
    return {
      ...service,
      serviceOptions: service.serviceOptions || [],
    };
  },

  async createService(input: CreateServiceInput): Promise<ServiceItem> {
    const services = getStoredServices();
    const formattedDate = formatCurrentDateTime();

    const newService: ServiceItem = {
      id: `serv-${Date.now()}`,
      name: input.name,
      category: input.category,
      imageUrl: input.imageUrl,
      serviceOptions: input.serviceOptions.map((sub, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        option_id: `sub-${Date.now()}-${idx}`,
        name: sub.name,
        option_name: sub.name,
        price: Number(sub.price) || 0,
        unit: sub.unit,
      })),
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    const updatedList = [newService, ...services];
    saveStoredServices(updatedList);
    return newService;
  },

  async updateService(
    id: string,
    input: UpdateServiceInput
  ): Promise<ServiceItem | null> {
    const services = getStoredServices();
    const index = services.findIndex((s) => String(s.id) === String(id));
    if (index === -1) return null;

    const formattedDate = formatCurrentDateTime();

    const updatedService: ServiceItem = {
      ...services[index],
      name: input.name,
      category: input.category,
      imageUrl: input.imageUrl,
      serviceOptions: input.serviceOptions.map((sub, idx) => ({
        id: String(sub.id || sub.option_id || `sub-${Date.now()}-${idx}`),
        option_id: sub.option_id || sub.id || `sub-${Date.now()}-${idx}`,
        name: sub.name,
        option_name: sub.name,
        price: Number(sub.price) || 0,
        unit: sub.unit,
      })),
      updatedAt: formattedDate,
    };

    services[index] = updatedService;
    saveStoredServices(services);
    return updatedService;
  },

  async deleteService(id: string): Promise<boolean> {
    const services = getStoredServices();
    const filtered = services.filter((s) => String(s.id) !== String(id));
    saveStoredServices(filtered);
    return true;
  },

  async reorderServices(newOrderServices: ServiceItem[]): Promise<void> {
    saveStoredServices(newOrderServices);
  },
};
