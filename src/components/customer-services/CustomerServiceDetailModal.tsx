"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import type { CustomerServiceOrder, CustomerServiceStatus } from "@/types/customer-service";

interface CustomerServiceDetailModalProps {
  order: CustomerServiceOrder | null;
  open: boolean;
  onClose: () => void;
}

const getStatusBadge = (status?: CustomerServiceStatus, customText?: string) => {
  switch (status) {
    case "in_progress":
      return {
        label: customText || "กำลังดำเนินการ",
        bg: "bg-[#FEF3C7]",
        text: "text-[#D97706]",
        border: "border-[#FDE68A]",
      };
    case "completed":
      return {
        label: customText || "ดำเนินการสำเร็จ",
        bg: "bg-[#DCFCE7]",
        text: "text-[#16A34A]",
        border: "border-[#BBF7D0]",
      };
    case "cancelled":
      return {
        label: customText || "ยกเลิกแล้ว",
        bg: "bg-[#FEE2E2]",
        text: "text-[#DC2626]",
        border: "border-[#FECACA]",
      };
    case "pending":
    default:
      return {
        label: customText || "รอดำเนินการ",
        bg: "bg-[#E2E8F0]",
        text: "text-[#475569]",
        border: "border-[#CBD5E1]",
      };
  }
};

export function CustomerServiceDetailModal({
  order,
  open,
  onClose,
}: CustomerServiceDetailModalProps) {
  if (!order) return null;

  const statusBadge = getStatusBadge(order.status, order.statusText);
  const formattedTotalPrice = order.totalPrice.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.15)",
            overflow: "hidden",
            border: "1px solid #E2E8F0",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: { xs: 2.5, sm: 3 },
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.75rem", display: "block" }}
          >
            รายละเอียดคำสั่งซ่อม
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1E293B", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
          >
            รหัส : {order.orderCode}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="ปิดหน้าต่าง"
          sx={{
            color: "#64748B",
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, bgcolor: "#FFFFFF" }}>
        {/* Status Card */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 3,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <BuildOutlinedIcon sx={{ color: "#3366FF", fontSize: 22 }} />
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
                สถานะการดำเนินการ
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                {statusBadge.label}
              </Typography>
            </Box>
          </Box>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
          >
            {statusBadge.label}
          </span>
        </Box>

        {/* Schedule & Technician Info */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: "#3366FF" }} />
            ข้อมูลการนัดหมาย
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              p: 2,
              borderRadius: "12px",
              bgcolor: "#F8FAFC",
              border: "1px solid #F1F5F9",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                วันที่ให้บริการ
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                {order.scheduledDate}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                เวลาดำเนินการ
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                  {order.scheduledTime}
                </Typography>
              </Box>
            </Box>

            {order.technicianName && (
              <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                  ช่างผู้รับผิดชอบ
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: "#3366FF" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                      {order.technicianName}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PhoneOutlinedIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      fontSize: "0.75rem",
                      py: 0.25,
                      px: 1.25,
                      borderRadius: "6px",
                      textTransform: "none",
                      color: "#3366FF",
                      borderColor: "#BFDBFE",
                    }}
                  >
                    ติดต่อช่าง
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Service Address */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "#3366FF" }} />
            สถานที่ให้บริการ
          </Typography>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
            <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
              {order.address || "กรุงเทพมหานครและปริมณฑล (ที่อยู่ตามที่ระบุไว้ในโปรไฟล์)"}
            </Typography>
            {order.notes && (
              <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.5 }}>
                ข้อมูลเพิ่มเติม: {order.notes}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Order Items & Price Breakdown */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
          >
            <ReceiptLongOutlinedIcon sx={{ fontSize: 18, color: "#3366FF" }} />
            รายการบริการที่จอง
          </Typography>

          <Box sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <Box sx={{ bgcolor: "#F8FAFC", p: 1.5, px: 2, borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B" }}>รายการ</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B" }}>จำนวน</Typography>
            </Box>

            <Box sx={{ p: 2, divideY: "1px solid #F1F5F9" }}>
              {order.items.map((item) => (
                <Box key={item.id} sx={{ py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      บริการมาตรฐาน พร้อมรับประกันคุณภาพ
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#3366FF" }}>
                    {item.quantity} {item.unit || "เครื่อง"}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider />

            {/* Total Price Section */}
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CreditCardOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                  ยอดชำระสุทธิ (ชำระแล้ว)
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#3366FF" }}>
                {formattedTotalPrice} ฿
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          px: 3,
          bgcolor: "#F8FAFC",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#3366FF",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            textTransform: "none",
            "&:hover": { bgcolor: "#2554DB" },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </Box>
    </Dialog>
  );
}

export default CustomerServiceDetailModal;
