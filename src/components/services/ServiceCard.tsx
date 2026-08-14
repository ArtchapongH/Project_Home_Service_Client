"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { ServiceItem } from "@/types/service";

interface ServiceCardProps {
  service: ServiceItem;
  onCategoryClick?: (category: string) => void;
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "บริการห้องครัว":
      return {
        bgcolor: "#F3EDFB",
        color: "#8A4AF3",
        border: "1px solid #E9D5FF",
        "&:hover": {
          bgcolor: "#E9D5FF",
        },
      };
    case "บริการห้องน้ำ":
      return {
        bgcolor: "#E6FBF7",
        color: "#00A982",
        border: "1px solid #CCFBF1",
        "&:hover": {
          bgcolor: "#CCFBF1",
        },
      };
    case "บริการทั่วไป":
    default:
      return {
        bgcolor: "#EBF0FF",
        color: "#3366FF",
        border: "1px solid #DBEAFE",
        "&:hover": {
          bgcolor: "#DBEAFE",
        },
      };
  }
};

/**
 * ฟังก์ชันจัดรูปแบบราคาตามเงื่อนไขข้อ 2:
 * - ถ้ามีช่วงราคา (minPrice & maxPrice ที่ต่างกัน): แสดง "ค่าบริการประมาณ min - max ฿"
 * - ถ้ามีราคาเดียว: แสดง "ค่าบริการประมาณ min ฿"
 */
export function formatServicePrice(minPrice: number = 0, maxPrice?: number): string {
  const formatNumber = (num: number) =>
    num.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (maxPrice && maxPrice > minPrice) {
    return `ค่าบริการประมาณ ${formatNumber(minPrice)} - ${formatNumber(maxPrice)} ฿`;
  }
  return `ค่าบริการประมาณ ${formatNumber(minPrice)} ฿`;
}

export function ServiceCard({ service, onCategoryClick }: ServiceCardProps) {
  const categoryStyle = getCategoryStyles(service.category);
  const formattedPrice =
    service.price ||
    formatServicePrice(service.minPrice || 0, service.maxPrice);
  const imageSrc =
    service.image ||
    service.imageUrl ||
    service.image_url ||
    "/images/landing/service-aircon.png";
  const serviceLink = `/services/${service.slug || service.id}`;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.25s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(23, 51, 109, 0.08)",
          borderColor: "#CBD5E1",
        },
      }}
    >
      {/* Image Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 200,
          bgcolor: "#F3F4F6",
          overflow: "hidden",
        }}
      >
        <Image
          src={imageSrc}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          p: 2.5,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          "&:last-child": { pb: 2.5 },
        }}
      >
        {/* จุดที่ 3: Tag หมวดหมู่ เมื่อกดจะเปลี่ยน filter ไปที่หมวดหมู่นั้นทันที */}
        <Chip
          label={service.category}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (onCategoryClick) {
              onCategoryClick(service.category);
            }
          }}
          sx={{
            ...categoryStyle,
            fontWeight: 500,
            fontSize: "0.75rem",
            height: "24px",
            borderRadius: "12px",
            mb: 1.5,
            px: 0.5,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        />

        {/* Service Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "#1E293B",
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {service.name}
        </Typography>

        {/* จุดที่ 2: การแสดงราคาแบบมีช่วงราคา หรือ ราคาเดียว */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            color: "#64748B",
            mb: 2.5,
          }}
        >
          <SellOutlinedIcon
            sx={{
              fontSize: 16,
              color: "#94A3B8",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              color: "#64748B",
            }}
          >
            {formattedPrice}
          </Typography>
        </Box>

        {/* Action Link */}
        <Box sx={{ mt: "auto" }}>
          <Link
            href={serviceLink}
            className="text-[13px] font-semibold text-[#3366FF] underline underline-offset-4 transition hover:text-[#1E40AF]"
          >
            เลือกบริการ
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
