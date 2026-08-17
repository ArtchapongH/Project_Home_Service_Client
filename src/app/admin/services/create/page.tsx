"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { useServiceContext } from "@/contexts/ServiceContext";
import { CreateServiceInput } from "@/types/service";

export default function AdminCreateServicePage() {
  const router = useRouter();
  const { addService } = useServiceContext();

  const handleCreate = async (data: CreateServiceInput) => {
    await addService(data);
    router.push("/admin/services");
  };

  return <ServiceForm mode="create" onSubmit={handleCreate} />;
}
