"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useServiceContext } from "../../../../src/contexts/ServiceContext";
import { ServiceItem } from "../../../../src/types/service";

function getCategoryChipColor(category: string): { bg: string; color: string } {
  switch (category) {
    case "บริการห้องครัว":
      return { bg: "#F4E6FF", color: "#6B11B5" };
    case "บริการห้องน้ำ":
      return { bg: "#E5F9F6", color: "#009282" };
    case "บริการห้องนอน":
      return { bg: "#FFF0E6", color: "#B54708" };
    case "บริการทั่วไป":
    default:
      return { bg: "#E7F0FF", color: "#0E49B5" };
  }
}

export default function AdminServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getService } = useServiceContext();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const data = await getService(resolvedParams.id);
      setService(data);
      setLoading(false);
    }
    loadDetail();
  }, [resolvedParams.id, getService]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={36} sx={{ mb: 2, color: "#3366FF" }} />
          <Typography variant="body2" color="text.secondary">
            กำลังโหลดรายละเอียดบริการ...
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
            บริการที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ
          </Typography>
          <Button variant="contained" onClick={() => router.push("/admin/services")} sx={{ borderRadius: "8px", bgcolor: "#3366FF" }}>
            กลับสู่รายการบริการ
          </Button>
        </Paper>
      </Box>
    );
  }

  const chipColor = getCategoryChipColor(service.category);
  const optionsList = service.serviceOptions || [];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F3F4F6", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        {/* Header Bar */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 3,
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton component={Link} href="/admin/services" sx={{ color: "grey.600" }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                บริการ
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: "#1F2937" }}>
                {service.name}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            component={Link}
            href={`/admin/services/${service.id}/edit`}
            sx={{ borderRadius: "8px", px: 3, bgcolor: "#3366FF", "&:hover": { bgcolor: "#2557E0" } }}
          >
            แก้ไข
          </Button>
        </Paper>

        {/* Detail Card */}
        <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #E5E7EB", p: { xs: 3, md: 4 }, bgcolor: "#FFFFFF" }}>
          {/* Main Info */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, width: 140, flexShrink: 0 }}>
              ชื่อบริการ
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1F2937" }}>{service.name}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, width: 140, flexShrink: 0 }}>
              หมวดหมู่
            </Typography>
            <Chip
              label={service.category}
              size="small"
              sx={{ bgcolor: chipColor.bg, color: chipColor.color, fontWeight: 600, borderRadius: "8px" }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3, gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, width: 140, flexShrink: 0, pt: 1 }}>
              รูปภาพ
            </Typography>
            <Box sx={{ maxWidth: 440, width: "100%" }}>
              {service.imageUrl ? (
                <Box sx={{ width: "100%", height: 180, borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                  <img src={service.imageUrl} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%", height: 180, bgcolor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ImageOutlinedIcon sx={{ fontSize: 32, color: "grey.300", mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">ไม่มีรูปภาพ</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: "#E5E7EB" }} />

          {/* Sub-services Section */}
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: "#374151" }}>
            รายการบริการย่อย
          </Typography>

          {optionsList.length > 0 ? (
            <TableContainer sx={{ border: "1px solid #E5E7EB", borderRadius: "8px" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#EFEFEF" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>ชื่อรายการ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>หน่วยบริการ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>ค่าบริการ / 1 หน่วย</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optionsList.map((sub, idx) => (
                    <TableRow key={sub.id || sub.option_id || idx} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                          {sub.name || sub.option_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{sub.unit}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                          {Number(sub.price).toFixed(2)} ฿
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">ไม่มีรายการบริการย่อย</Typography>
          )}

          <Divider sx={{ my: 4, borderColor: "#E5E7EB" }} />

          {/* Timestamps */}
          <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
            <Box sx={{ display: "flex", gap: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, width: 120 }}>
                สร้างเมื่อ
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>{service.createdAt}</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, width: 120 }}>
                แก้ไขล่าสุด
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151" }}>{service.updatedAt}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
