"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Paper,
  InputBase,
  Menu,
  MenuItem,
  Button,
  Divider,
  Popover,
  Slider,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { PublicCategory, PublicServiceSort } from "@/src/types/public-service";

interface ServiceBannerProps {
  categories: PublicCategory[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  sortBy: PublicServiceSort;
  onSortByChange: (value: PublicServiceSort) => void;
  onSearchSubmit: () => void;
  onClearSearch: () => void;
}

const SORT_OPTIONS: { label: string; value: PublicServiceSort }[] = [
  { label: "บริการแนะนำ", value: "recommended" },
  { label: "บริการยอดนิยม", value: "popular" },
  { label: "ตามตัวอักษร (Ascending)", value: "asc" },
  { label: "ตามตัวอักษร (Descending)", value: "desc" },
];

export function ServiceBanner({
  categories,
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  onSearchSubmit,
  onClearSearch,
}: ServiceBannerProps) {
  const categoryOptions = [
    { label: "บริการทั้งหมด", value: "all" },
    ...categories.map((item) => ({ label: item.name, value: item.name })),
  ];
  // Category Menu State
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const isCategoryOpen = Boolean(categoryAnchorEl);

  // Price Popover State
  const [priceAnchorEl, setPriceAnchorEl] = useState<null | HTMLElement>(null);
  const isPriceOpen = Boolean(priceAnchorEl);

  // Sort Menu State
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const isSortOpen = Boolean(sortAnchorEl);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  const currentCategoryLabel =
    categoryOptions.find((c) => c.value === category)?.label || "บริการทั้งหมด";

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "บริการแนะนำ";

  return (
    <Box component="section" sx={{ width: "100%" }}>
      {/* Top Breadcrumb / Page Tag */}
      <Box
        sx={{
          bgcolor: "#F8F9FA",
          px: { xs: 2, sm: 4, md: 6 },
          py: 1.2,
          borderBottom: "1px solid #EDEDED",
        }}
      >
        <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Service List
          </Typography>
        </div>
      </Box>

      {/* Main Hero Banner with Background Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: 240, md: 280 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Image
          src="/images/services/banner-bg.jpg"
          alt="บริการของเรา"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark Blue Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(15, 33, 73, 0.72)",
            zIndex: 1,
          }}
        />

        {/* Text Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "#FFFFFF",
            px: 2,
            py: { xs: 4, md: 5 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              mb: 1.5,
              letterSpacing: "-0.02em",
            }}
          >
            บริการของเรา
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              color: "#E2E8F0",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {"ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย\nโดยพนักงานแม่บ้าน และช่างมืออาชีพ"}
          </Typography>
        </Box>
      </Box>

      {/* Filter / Search Bar Section (Sticky Top & Interactive) */}
      <Box
        id="service-filter-bar"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
          py: { xs: 2, md: 1.75 },
          px: { xs: 2, md: 3 },
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: { xs: "stretch", lg: "center" },
              justifyContent: "space-between",
              gap: { xs: 2, lg: 2 },
              bgcolor: "transparent",
            }}
          >
            {/* Search Input Box with Active Focus Style */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", lg: "1 1 340px" },
                display: "flex",
                alignItems: "center",
                border: "1.5px solid",
                borderColor: searchQuery.trim() ? "#3366FF" : "#CBD5E1",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                bgcolor: "#FFFFFF",
                transition: "all 0.2s ease-in-out",
                "&:focus-within": {
                  borderColor: "#3366FF",
                  boxShadow: "0 0 0 3px rgba(51, 102, 255, 0.12)",
                },
              }}
            >
              <SearchIcon
                sx={{
                  color: searchQuery.trim() ? "#3366FF" : "#94A3B8",
                  mr: 1,
                  fontSize: 22,
                  transition: "color 0.2s ease",
                }}
              />
              <InputBase
                placeholder="ค้นหาบริการ.."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  flex: 1,
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                  color: "#1E293B",
                  "& input::placeholder": {
                    color: "#94A3B8",
                    opacity: 1,
                  },
                }}
              />
              {searchQuery && (
                <IconButton
                  size="small"
                  onClick={onClearSearch}
                  aria-label="ล้างคำค้นหา"
                  sx={{ p: 0.5, color: "#94A3B8", "&:hover": { color: "#475569" } }}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>

            {/* Filter Dropdowns Group */}
            <Box
              sx={{
                display: "flex",
                flexWrap: { xs: "wrap", sm: "nowrap" },
                alignItems: "center",
                gap: { xs: 2, sm: 1.5, md: 2 },
                flexGrow: 1,
                justifyContent: { xs: "space-between", lg: "flex-end" },
              }}
            >
              {/* 1. Category Trigger */}
              <Box sx={{ minWidth: { xs: "100%", sm: 130, md: 150 } }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    mb: 0.25,
                  }}
                >
                  หมวดหมู่บริการ
                </Typography>
                <Box
                  onClick={(e) => setCategoryAnchorEl(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    py: 0.5,
                    gap: 1,
                    userSelect: "none",
                    "&:hover": { color: "#3366FF" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "0.875rem",
                    }}
                  >
                    {currentCategoryLabel}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{
                      color: "#64748B",
                      fontSize: 20,
                      transform: isCategoryOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </Box>
              </Box>

              {/* Category Dropdown Menu */}
              <Menu
                anchorEl={categoryAnchorEl}
                open={isCategoryOpen}
                onClose={() => setCategoryAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #F1F5F9",
                      p: 1,
                    },
                  },
                }}
              >
                {categoryOptions.map((opt) => {
                  const isSelected = category === opt.value;
                  return (
                    <MenuItem
                      key={opt.value}
                      onClick={() => {
                        onCategoryChange(opt.value);
                        setCategoryAnchorEl(null);
                      }}
                      sx={{
                        py: 1,
                        px: 1.75,
                        borderRadius: "8px",
                        fontSize: "0.9375rem",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "#3366FF" : "#334155",
                        bgcolor: isSelected ? "rgba(51, 102, 255, 0.04)" : "transparent",
                        "&:hover": {
                          bgcolor: "#F8FAFC",
                          color: "#3366FF",
                        },
                      }}
                    >
                      {opt.label}
                    </MenuItem>
                  );
                })}
              </Menu>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderColor: "#E2E8F0",
                  height: 36,
                  alignSelf: "center",
                }}
              />

              {/* 2. Price Range Trigger */}
              <Box sx={{ minWidth: { xs: "48%", sm: 110, md: 130 } }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    mb: 0.25,
                  }}
                >
                  ราคา
                </Typography>
                <Box
                  onClick={(e) => setPriceAnchorEl(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    py: 0.5,
                    gap: 1,
                    userSelect: "none",
                    "&:hover": { color: "#3366FF" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "0.875rem",
                    }}
                  >
                    {`${priceRange[0]}-${priceRange[1]}฿`}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{
                      color: "#64748B",
                      fontSize: 20,
                      transform: isPriceOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </Box>
              </Box>

              {/* Price Range Slider Popover */}
              <Popover
                anchorEl={priceAnchorEl}
                open={isPriceOpen}
                onClose={() => setPriceAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      mt: 1,
                      width: 280,
                      p: 2.5,
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #F1F5F9",
                    },
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "#1E293B",
                      mb: 2,
                    }}
                  >
                    {`${priceRange[0]}-${priceRange[1]}฿`}
                  </Typography>

                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) =>
                      onPriceRangeChange(newValue as [number, number])
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={3000}
                    step={100}
                    marks={[
                      { value: 0 },
                      { value: 500 },
                      { value: 1000 },
                      { value: 1500 },
                      { value: 2000 },
                      { value: 3000 },
                    ]}
                    sx={{
                      color: "#3366FF",
                      height: 6,
                      "& .MuiSlider-track": {
                        border: "none",
                        bgcolor: "#3366FF",
                      },
                      "& .MuiSlider-rail": {
                        bgcolor: "#E2E8F0",
                        opacity: 1,
                      },
                      "& .MuiSlider-mark": {
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: "#94A3B8",
                        transform: "translate(-50%, -50%)",
                        top: "50%",
                      },
                      "& .MuiSlider-markActive": {
                        bgcolor: "#FFFFFF",
                        border: "1.5px solid #3366FF",
                        opacity: 1,
                      },
                      "& .MuiSlider-thumb": {
                        height: 20,
                        width: 20,
                        backgroundColor: "#3366FF",
                        border: "3px solid #FFFFFF",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                          boxShadow: "0 0 0 8px rgba(51, 102, 255, 0.16)",
                        },
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#3366FF", fontWeight: 700, fontSize: "0.875rem" }}
                    >
                      {priceRange[0]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#3366FF", fontWeight: 700, fontSize: "0.875rem" }}
                    >
                      {priceRange[1]}
                    </Typography>
                  </Box>
                </Box>
              </Popover>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderColor: "#E2E8F0",
                  height: 36,
                  alignSelf: "center",
                }}
              />

              {/* 3. Sort By Trigger */}
              <Box sx={{ minWidth: { xs: "48%", sm: 170, md: 190 } }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#64748B",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    mb: 0.25,
                  }}
                >
                  เรียงตาม
                </Typography>
                <Box
                  onClick={(e) => setSortAnchorEl(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    py: 0.5,
                    gap: 1,
                    userSelect: "none",
                    "&:hover": { color: "#3366FF" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "0.875rem",
                    }}
                  >
                    {currentSortLabel}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{
                      color: "#64748B",
                      fontSize: 20,
                      transform: isSortOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </Box>
              </Box>

              {/* Sort By Dropdown Menu */}
              <Menu
                anchorEl={sortAnchorEl}
                open={isSortOpen}
                onClose={() => setSortAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      mt: 1,
                      minWidth: 230,
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #F1F5F9",
                      p: 1,
                    },
                  },
                }}
              >
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <MenuItem
                      key={opt.value}
                      onClick={() => {
                        onSortByChange(opt.value);
                        setSortAnchorEl(null);
                      }}
                      sx={{
                        py: 1,
                        px: 1.75,
                        borderRadius: "8px",
                        fontSize: "0.9375rem",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "#3366FF" : "#334155",
                        bgcolor: isSelected ? "rgba(51, 102, 255, 0.04)" : "transparent",
                        "&:hover": {
                          bgcolor: "#F8FAFC",
                          color: "#3366FF",
                        },
                      }}
                    >
                      {opt.label}
                    </MenuItem>
                  );
                })}
              </Menu>

              {/* Search Button */}
              <Button
                variant="contained"
                onClick={onSearchSubmit}
                sx={{
                  bgcolor: "#3366FF",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  px: 3.5,
                  py: 1,
                  borderRadius: "8px",
                  boxShadow: "none",
                  minHeight: "42px",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    bgcolor: "#2554DB",
                    boxShadow: "0 4px 12px rgba(51, 102, 255, 0.25)",
                  },
                }}
              >
                ค้นหา
              </Button>
            </Box>
          </Paper>
        </div>
      </Box>
    </Box>
  );
}
