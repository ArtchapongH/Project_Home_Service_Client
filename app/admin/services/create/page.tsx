"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "../../../../src/components/admin/ServiceForm";
import { useServiceContext } from "../../../../src/contexts/ServiceContext";
import { CreateServiceInput } from "../../../../src/types/service";

export default function AdminCreateServicePage() {
  const router = useRouter();
  const { addService } = useServiceContext();

  const handleCreate = async (data: CreateServiceInput) => {
    await addService(data);
    router.push("/admin/services");
  };

  return <ServiceForm mode="create" onSubmit={handleCreate} />;
}
