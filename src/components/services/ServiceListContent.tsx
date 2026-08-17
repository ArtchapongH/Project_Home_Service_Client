"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button, Fade, CircularProgress } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { ServiceBanner } from "./ServiceBanner";
import { ServiceCard } from "./ServiceCard";
import { ServiceBottomBanner } from "./ServiceBottomBanner";
import {
  getApiErrorMessage,
  getPublicCategories,
  getPublicServices,
} from "@/src/services/publicServiceApi";
import type {
  PublicCategory,
  PublicService,
  PublicServiceSort,
} from "@/src/types/public-service";

export function ServiceListContent() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [sortBy, setSortBy] = useState<PublicServiceSort>("recommended");

  useEffect(() => {
    let active = true;
    Promise.all([getPublicServices(), getPublicCategories()])
      .then(([serviceData, categoryData]) => {
        if (!active) return;
        setServices(serviceData);
        setCategories(categoryData);
      })
      .catch((reason) => {
        if (active) setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredServices = useMemo(() => services
    .filter((service) => {
      const query = searchQuery.trim().toLowerCase();
      if (query && !service.name.toLowerCase().includes(query) && !service.category.toLowerCase().includes(query)) return false;
      if (category !== "all" && service.category !== category) return false;
      return service.minPrice >= priceRange[0] && service.minPrice <= priceRange[1];
    })
    .sort((a, b) => {
      if (sortBy === "recommended") return Number(b.isFeatured) - Number(a.isFeatured) || a.displayOrder - b.displayOrder;
      if (sortBy === "popular") return b.popularityScore - a.popularityScore;
      return sortBy === "asc"
        ? a.name.localeCompare(b.name, "th")
        : b.name.localeCompare(a.name, "th");
    }), [services, searchQuery, category, priceRange, sortBy]);

  const handleSearchSubmit = () => document.getElementById("services-grid-section")?.scrollIntoView({ behavior: "smooth" });
  const handleCategoryClick = (value: string) => {
    setCategory(value);
    document.getElementById("service-filter-bar")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setPriceRange([0, 3000]);
    setSortBy("recommended");
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#F3F4F6", minHeight: "100vh" }}>
      <ServiceBanner
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={() => setSearchQuery("")}
      />
      <Box id="services-grid-section" component="section" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 0 } }}>
        <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress aria-label="กำลังโหลดบริการ" /></Box>
          ) : error ? (
            <Box role="alert" sx={{ textAlign: "center", py: 8, bgcolor: "#FEF2F2", color: "#B91C1C", borderRadius: "14px" }}>{error}</Box>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredServices.map((service, index) => (
                <div key={service.id} className="animate-service-card" style={{ animationDelay: `${index * 160}ms`, opacity: 0 }}>
                  <ServiceCard service={service} onCategoryClick={handleCategoryClick} />
                </div>
              ))}
            </div>
          ) : (
            <Fade in timeout={400}>
              <Box sx={{ textAlign: "center", py: 10, px: 3, bgcolor: "#FFFFFF", borderRadius: "14px", border: "1px dashed #CBD5E1" }}>
                <SearchOffIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>ไม่พบบริการที่คุณค้นหา</Typography>
                <Button variant="outlined" onClick={handleResetFilters}>ล้างตัวกรองทั้งหมด</Button>
              </Box>
            </Fade>
          )}
        </div>
      </Box>
      <ServiceBottomBanner />
    </Box>
  );
}
