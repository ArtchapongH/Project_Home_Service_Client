"use client";

import React, { useMemo, useState } from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { ServiceBanner } from "./ServiceBanner";
import { ServiceCard } from "./ServiceCard";
import { ServiceBottomBanner } from "./ServiceBottomBanner";
import { ServiceItem, SortOption } from "@/types/service";

interface ServiceListContentProps {
  initialServices: ServiceItem[];
}

export function ServiceListContent({ initialServices }: ServiceListContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const handleSearchSubmit = () => {
    const gridSection = document.getElementById("services-grid-section");
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  /**
   * จุดที่ 3: เมื่อกด Tag หมวดหมู่บนการ์ดบริการ
   * จะเปลี่ยน Filter ด้านบนไปที่หมวดหมู่นั้นทันที
   */
  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory);
    const filterBar = document.getElementById("service-filter-bar");
    if (filterBar) {
      filterBar.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // กรองข้อมูลแบบเรียลไทม์ตาม Search Query, Category, Price Range และ Sorting
  const filteredServices = useMemo(() => {
    return initialServices
      .filter((service) => {
        // 1. Search Query Filter (ค้นหาตามชื่อบริการ หรือหมวดหมู่)
        const query = searchQuery.trim().toLowerCase();
        if (query) {
          const matchName = service.name.toLowerCase().includes(query);
          const matchCategory = service.category.toLowerCase().includes(query);
          if (!matchName && !matchCategory) return false;
        }

        // 2. Category Filter
        if (category !== "all" && service.category !== category) {
          return false;
        }

        // 3. Price Range Filter [min, max]
        const [minFilter, maxFilter] = priceRange;
        const basePrice = service.minPrice ?? 0;
        if (basePrice < minFilter || basePrice > maxFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recommended") {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return 0;
        }
        if (sortBy === "popular") {
          return (b.popularityScore || 0) - (a.popularityScore || 0);
        }
        if (sortBy === "asc") {
          return a.name.localeCompare(b.name, "th");
        }
        if (sortBy === "desc") {
          return b.name.localeCompare(a.name, "th");
        }
        return 0;
      });
  }, [initialServices, searchQuery, category, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setPriceRange([0, 2000]);
    setSortBy("recommended");
  };

  // สร้าง Key เพื่อ Trigger Animation เมื่อเงื่อนไขการค้นหา/กรองเปลี่ยน
  const filterKey = `${searchQuery}-${category}-${priceRange.join("-")}-${sortBy}`;

  return (
    <Box sx={{ width: "100%", bgcolor: "#F3F4F6", minHeight: "100vh" }}>
      {/* 1. Top Section: Hero Banner & Sticky Search/Filter Controls */}
      <ServiceBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />

      {/* 2. Middle Section: Services Grid with Staggered Entrance Animation */}
      <Box
        id="services-grid-section"
        component="section"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
          {filteredServices.length > 0 ? (
            <div
              key={filterKey}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              {filteredServices.map((service, index) => (
                <div
                  key={service.id || service.slug}
                  className="animate-service-card"
                  style={{
                    animationDelay: `${index * 160}ms`,
                    opacity: 0,
                  }}
                >
                  <ServiceCard
                    service={service}
                    onCategoryClick={handleCategoryClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Fade in={true} timeout={400}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 10,
                  px: 3,
                  bgcolor: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px dashed #CBD5E1",
                }}
              >
                <SearchOffIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1E293B", mb: 1 }}
                >
                  ไม่พบบริการที่คุณค้นหา
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748B", mb: 3, maxWidth: 400, mx: "auto" }}
                >
                  ลองปรับเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นหาบริการที่ต้องการ
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{
                    color: "#3366FF",
                    borderColor: "#3366FF",
                    fontWeight: 600,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "rgba(51, 102, 255, 0.04)",
                      borderColor: "#2554DB",
                    },
                  }}
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              </Box>
            </Fade>
          )}
        </div>
      </Box>

      {/* 3. Bottom Section: Blue Info Banner */}
      <ServiceBottomBanner />
    </Box>
  );
}
