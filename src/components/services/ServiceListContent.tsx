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
  isCanceledRequest,
} from "@/services/publicServiceApi";
import type {
  PublicCategory,
  PublicService,
  PublicServiceSort,
} from "@/types/public-service";
import { useTranslations, useLocale } from "next-intl";

export function ServiceListContent() {  
  const t = useTranslations("Services");
  const locale = useLocale();
  const [services, setServices] = useState<PublicService[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [appliedCategory, setAppliedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 3000]);
  const [sortBy, setSortBy] = useState<PublicServiceSort>("recommended");
  const [appliedSortBy, setAppliedSortBy] = useState<PublicServiceSort>("recommended");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    Promise.all([
      getPublicServices({ locale, signal: controller.signal }),
      getPublicCategories(locale, controller.signal),
    ])
      .then(([serviceData, categoryData]) => {
        if (!active) return;
        setServices(serviceData);
        setCategories(categoryData);
      })
      .catch((reason) => {
        if (!active || isCanceledRequest(reason)) return;
        setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [locale]);

  const getPopularityWeight = (service: PublicService) => {
    const reviews = service.reviewCount ?? 0;
    const rating = service.averageRating ?? 0;
    const score = service.popularityScore ?? 0;
    // Prioritize services that actually have real user reviews and high ratings
    return reviews * 100 + rating * 20 + score;
  };

  const filteredServices = useMemo(() => services
    .filter((service) => {
      const query = appliedSearchQuery.trim().toLowerCase();
      if (query && !service.name.toLowerCase().includes(query) && !service.category.toLowerCase().includes(query)) return false;
      if (appliedCategory !== "all" && service.categoryId !== appliedCategory) return false;
      return service.minPrice >= appliedPriceRange[0] && service.minPrice <= appliedPriceRange[1];
    })
    .sort((a, b) => {
      if (appliedSortBy === "recommended") return Number(b.isFeatured) - Number(a.isFeatured) || a.displayOrder - b.displayOrder;
      if (appliedSortBy === "popular") return getPopularityWeight(b) - getPopularityWeight(a);
      return appliedSortBy === "asc"
        ? a.name.localeCompare(b.name, locale)
        : b.name.localeCompare(a.name, locale);
    }), [services, appliedSearchQuery, appliedCategory, appliedPriceRange, appliedSortBy, locale]);

  const topPopularIds = useMemo(() => {
    // Only give popular badges to services that have real reviews or top calculated popularity
    const sorted = [...services]
      .filter((s) => (s.reviewCount ?? 0) > 0 || (s.popularityScore ?? 0) > 0)
      .sort((a, b) => getPopularityWeight(b) - getPopularityWeight(a));
    return new Set(sorted.slice(0, 3).map((s) => s.id));
  }, [services]);

  const handleSearchSubmit = (queryOverride?: string) => {
    setAppliedSearchQuery(typeof queryOverride === "string" ? queryOverride : searchInput);
    setAppliedCategory(category);
    setAppliedPriceRange(priceRange);
    setAppliedSortBy(sortBy);
  };

  const handleCategoryClick = (value: string) => {
    setCategory(value);
    setAppliedCategory(value);
    document.getElementById("service-filter-bar")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setAppliedSearchQuery("");
    setCategory("all");
    setAppliedCategory("all");
    setPriceRange([0, 3000]);
    setAppliedPriceRange([0, 3000]);
    setSortBy("recommended");
    setAppliedSortBy("recommended");
  };

  const handleClearSearch = () => {
    setSearchInput("");
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#F3F4F6", minHeight: "100vh" }}>
      <ServiceBanner
        categories={categories}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        category={category}
        onCategoryChange={setCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />
      <Box id="services-grid-section" component="section" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 0 } }}>
        <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress aria-label={t("loading")} /></Box>
          ) : error ? (
            <Box role="alert" sx={{ textAlign: "center", py: 8, bgcolor: "#FEF2F2", color: "#B91C1C", borderRadius: "14px" }}>{error}</Box>
          ) : filteredServices.length > 0 ? (
            <div
              key={`${appliedSortBy}-${appliedCategory}-${appliedSearchQuery}-${appliedPriceRange.join("-")}`}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              {filteredServices.map((service, index) => (
                <div
                  key={`${appliedSortBy}-${service.id}`}
                  className="animate-service-card"
                  style={{ animationDelay: `${index * 110}ms`, opacity: 0 }}
                >
                  <ServiceCard
                    service={service}
                    sortBy={appliedSortBy}
                    isPopular={topPopularIds.has(service.id)}
                    onCategoryClick={handleCategoryClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Fade in timeout={400}>
              <Box sx={{ textAlign: "center", py: 10, px: 3, bgcolor: "#FFFFFF", borderRadius: "14px", border: "1px dashed #CBD5E1" }}>
                <SearchOffIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{t("emptyTitle")}</Typography>
                <Button variant="outlined" onClick={handleResetFilters}>{t("resetFilters")}</Button>
              </Box>
            </Fade>
          )}
        </div>
      </Box>
      <ServiceBottomBanner />
    </Box>
  );
}
