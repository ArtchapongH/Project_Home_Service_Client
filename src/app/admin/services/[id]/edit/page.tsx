"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { useServiceContext } from "@/contexts/ServiceContext";
import { ServiceItem, UpdateServiceInput } from "@/types/service";

export default function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getService, editService, removeService } = useServiceContext();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getService(resolvedParams.id);
      setService(data);
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id, getService]);

  const handleUpdate = async (data: UpdateServiceInput) => {
    if (!service) return;
    await editService(service.id, data);
    router.push(`/admin/services/${service.id}`);
  };

  const handleDelete = async (id: string) => {
    await removeService(id);
    router.push("/admin/services");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-gray-500">
        กำลังโหลดข้อมูลบริการสำหรับแก้ไข...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-red-500">
        ไม่พบข้อมูลบริการ
      </div>
    );
  }

  return (
    <ServiceForm
      mode="edit"
      initialData={service}
      onSubmit={handleUpdate}
      onDeleteService={handleDelete}
    />
  );
}

