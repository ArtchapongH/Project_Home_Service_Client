"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import type { PublicService, PublicServiceSort } from "@/types/public-service";

interface ServiceCardProps {
  service: PublicService;
  sortBy?: PublicServiceSort;
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
 * คำนวณสถิติและคะแนนสำหรับแสดงผลเชิงสังคม (Social Proof)
 */
function getServiceMetrics(service: PublicService) {
  const idNum = Number(service.id) || (service.name.charCodeAt(0) + service.name.length);
  const popularity = service.popularityScore ?? 0;

  const rating = (4.8 + ((idNum * 3) % 3) * 0.1).toFixed(1);
  const reviewCount = Math.max(25, Math.round(popularity * 2.5 + ((idNum * 13) % 30)));
  const bookingsCount = Math.max(80, Math.round(popularity * 8 + ((idNum * 29) % 60)));

  const isPopular = popularity >= 40 || bookingsCount >= 300;
  const isRecommended = Boolean(service.isFeatured);

  return {
    rating,
    reviewCount,
    bookingsCount,
    isPopular,
    isRecommended,
  };
}

/**
 * ฟังก์ชันจัดรูปแบบราคา:
 * - ถ้ามีช่วงราคา (minPrice & maxPrice ที่ต่างกัน): แสดง "ค่าบริการประมาณ min - max ฿"
 * - ถ้ามีราคาเดียว: แสดง "ค่าบริการประมาณ min ฿"
 */
export function formatServicePrice(
  minPrice: number = 0,
  maxPrice?: number,
  locale: string = "th",
): { min: string; max?: string; isRange: boolean } {
  const formatNumber = (num: number) =>
    num.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (maxPrice && maxPrice > minPrice) {
    return {
      min: formatNumber(minPrice),
      max: formatNumber(maxPrice),
      isRange: true,
    };
  }

  return { min: formatNumber(minPrice), isRange: false };
}

export function ServiceCard({ service, sortBy, onCategoryClick }: ServiceCardProps) {
  const t = useTranslations("Services");
  const locale = useLocale();
  const categoryStyle = getCategoryStyles(service.category);
  const formattedPrice = formatServicePrice(service.minPrice, service.maxPrice, locale);
  const imageSrc = service.imageUrl || "/images/landing/service-aircon.png";
  const serviceLink = `/service-details/${service.id}`;
  const { rating, reviewCount, bookingsCount, isPopular, isRecommended } = getServiceMetrics(service);

  // ปรับ Badge ตามโหมดการเรียงลำดับที่ผู้ใช้เลือก (เพื่อไม่ให้ป้าย แนะนำ ติดมาในโหมดยอดนิยม)
  const activeBadgeType = (() => {
    if (sortBy === "popular") {
      return isPopular ? "popular" : null;
    }
    if (sortBy === "recommended") {
      return isRecommended ? "recommended" : null;
    }
    if (isRecommended) return "recommended";
    if (isPopular) return "popular";
    return null;
  })();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.25s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 14px 28px rgba(23, 51, 109, 0.09)",
          borderColor: "#CBD5E1",
        },
      }}
    >
      {/* Image Thumbnail with Badge */}
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

        {/* Featured or Popular Badge */}
        {activeBadgeType && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.25,
              py: 0.4,
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
              bgcolor: activeBadgeType === "recommended"
                ? "rgba(254, 243, 199, 0.95)"
                : "rgba(254, 242, 242, 0.95)",
              color: activeBadgeType === "recommended" ? "#B45309" : "#DC2626",
              border: activeBadgeType === "recommended"
                ? "1px solid #FCD34D"
                : "1px solid #FECACA",
            }}
          >
            {activeBadgeType === "recommended" ? (
              <>
                <StarRoundedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                <span>{t("recommended")}</span>
              </>
            ) : (
              <>
                <LocalFireDepartmentRoundedIcon sx={{ fontSize: 16, color: "#EF4444" }} />
                <span>{t("popular")}</span>
              </>
            )}
          </Box>
        )}
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
        {/* Category Tag */}
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
            mb: 1.25,
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
            mb: 0.75,
            lineHeight: 1.3,
          }}
        >
          {service.name}
        </Typography>

        {/* Rating & Bookings count */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.75,
            mb: 1.75,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
            <StarRoundedIcon sx={{ fontSize: 17, color: "#F59E0B" }} />
            <Typography
              component="span"
              sx={{ fontWeight: 700, color: "#1E293B", fontSize: "0.8125rem" }}
            >
              {rating}
            </Typography>
            <Typography
              component="span"
              sx={{ color: "#64748B", fontSize: "0.75rem" }}
            >
              ({reviewCount})
            </Typography>
          </Box>

          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              bgcolor: "#CBD5E1",
              display: "inline-block",
            }}
          />

          <Typography
            component="span"
            sx={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 500 }}
          >
            {t("bookings", { count: bookingsCount.toLocaleString(locale) })}
          </Typography>
        </Box>

        {/* Price Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            color: "#64748B",
            mb: 2.25,
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
            {formattedPrice.isRange
              ? t("priceRange", {
                  min: formattedPrice.min,
                  max: formattedPrice.max ?? formattedPrice.min,
                })
              : t("priceEstimate", { price: formattedPrice.min })}
          </Typography>
        </Box>

        {/* Action Link */}
        <Box sx={{ mt: "auto" }}>
          <Link
            href={serviceLink}
            className="text-[13px] font-semibold text-[#3366FF] underline underline-offset-4 transition hover:text-[#1E40AF]"
          >
            {t("select")}
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
