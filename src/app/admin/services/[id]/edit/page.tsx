"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
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
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={36} sx={{ mb: 2, color: "#3366FF" }} />
          <Typography variant="body2" color="text.secondary">
            กำลังโหลดข้อมูลบริการสำหรับแก้ไข...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!service) {
    return (
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: "8px", border: "1px solid #E5E7EB", maxWidth: 400, textAlign: "center", bgcolor: "#FFFFFF" }}>
          <Box sx={{ width: 48, height: 48, bgcolor: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <WarningAmberRoundedIcon sx={{ color: "#EF4444" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            ไม่พบข้อมูลบริการ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ไม่พบรายการบริการที่ต้องการแก้ไข
          </Typography>
          <Button variant="contained" onClick={() => router.push("/admin/services")} sx={{ borderRadius: "8px", bgcolor: "#3366FF" }}>
            กลับสู่รายการบริการ
          </Button>
        </Paper>
      </Box>
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
