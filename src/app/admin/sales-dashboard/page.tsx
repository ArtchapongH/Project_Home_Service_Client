"use client";

import React, { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { DollarSign, ShoppingCart, Calendar, FileOutput } from "lucide-react";
// import adminAvatar from "@/assets/images/admin-dashboard-picture.png";
import {
  fetchDashboardTotalSales,
  fetchDashboardTotalOrders,
  fetchDashboardTopSalesByService,
  fetchDashboardSalesByDay,
  fetchDashboardSalesByServiceSubcategory,
  fetchDashboardDateRange,
} from "@/services/adminDashboardApi";

// TODO: replace mock data below with API calls once the backend SQL endpoints are ready.

type OrderRecord = {
  date: string; // ISO yyyy-mm-dd
  category: string;
  subcategory: string;
  sales: number;
  orders: number;
};

const SUBCATEGORIES: { category: string; subcategory: string; baseSales: number; baseOrders: number }[] = [
  { category: "Consulting", subcategory: "Business Consulting", baseSales: 8750, baseOrders: 130 },
  { category: "Consulting", subcategory: "IT Consulting", baseSales: 5420, baseOrders: 78 },
  { category: "Development", subcategory: "Web Development", baseSales: 6320, baseOrders: 105 },
  { category: "Development", subcategory: "Mobile App Development", baseSales: 4120, baseOrders: 68 },
  { category: "Design", subcategory: "UI/UX Design", baseSales: 4120, baseOrders: 70 },
  { category: "Design", subcategory: "Graphic Design", baseSales: 2480, baseOrders: 41 },
  { category: "Marketing", subcategory: "Social Media Marketing", baseSales: 3280, baseOrders: 56 },
  { category: "Marketing", subcategory: "Content Marketing", baseSales: 1980, baseOrders: 34 },
  { category: "Support", subcategory: "Technical Support", baseSales: 1110, baseOrders: 18 },
];

// Deterministic 0..1 pseudo-random value so the mock data is stable across renders.
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const MOCK_START_DATE = "2025-04-01";
const MOCK_END_DATE = "2025-04-30";
const MOCK_DAYS_IN_RANGE = 30;

// Generates day-by-day, per-subcategory order records for the whole mock month.
const MOCK_ORDERS: OrderRecord[] = Array.from({ length: MOCK_DAYS_IN_RANGE }, (_, dayIndex) => {
  const day = dayIndex + 1;
  const date = `2025-04-${String(day).padStart(2, "0")}`;
  const spike = day === 7 || day === 19 ? 1.6 : 1;

  return SUBCATEGORIES.map((sub, subIndex) => {
    const factor = (0.5 + pseudoRandom(day * 13 + subIndex * 7) * 1.2) * spike;
    return {
      date,
      category: sub.category,
      subcategory: sub.subcategory,
      sales: Math.round((sub.baseSales / MOCK_DAYS_IN_RANGE) * factor),
      orders: Math.round((sub.baseOrders / MOCK_DAYS_IN_RANGE) * factor),
    };
  });
}).flat();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const dayLabelFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const formatDayLabel = (value: string | Date) => {
  const dateOnly = value instanceof Date
    ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
    : String(value).slice(0, 10);
  const date = new Date(`${dateOnly}T00:00:00`);

  return Number.isNaN(date.getTime()) ? String(value) : dayLabelFormatter.format(date);
};

const escapeCsvCell = (value: string | number) => {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

function ExportCsvButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
    >
      <FileOutput className="h-4 w-4" />
      Export CSV
    </button>
  );
}

const shiftDateRange = (start: string, end: string) => {
  const startMs = new Date(`${start}T00:00:00`).getTime();
  const endMs = new Date(`${end}T00:00:00`).getTime();
  const rangeMs = endMs - startMs + 24 * 60 * 60 * 1000;
  const previousEnd = new Date(startMs - 24 * 60 * 60 * 1000);
  const previousStart = new Date(startMs - rangeMs);
  return {
    start: previousStart.toISOString().slice(0, 10),
    end: previousEnd.toISOString().slice(0, 10),
  };
};

export default function SalesDashboardPage() {
  const [startDate, setStartDate] = useState(MOCK_START_DATE);
  const [endDate, setEndDate] = useState(MOCK_END_DATE);
  const [initialStartDate, setInitialStartDate] = useState(MOCK_START_DATE);
  const [initialEndDate, setInitialEndDate] = useState(MOCK_END_DATE);
  const [apiTotalSales, setApiTotalSales] = useState<number | null>(null);
  const [apiTotalOrders, setApiTotalOrders] = useState<number | null>(null);
  const [topSalesByService, setTopSalesByService] = useState<{ serviceName: string; totalSales: number }[]>([]);
  const [salesByDay, setSalesByDay] = useState<{ date: string; totalSales: number }[]>([]);
  const [salesByServiceSubcategory, setSalesByServiceSubcategory] = useState<{
    serviceName: string;
    optionName: string;
    totalSales: number;
    totalOrders: number;
  }[]>([]);

  useEffect(() => {
    let isCancelled = false;

    fetchDashboardDateRange()
      .then(({ minDate, maxDate }) => {
        if (isCancelled) return;
        if (minDate) {
          setInitialStartDate(minDate);
          setStartDate(minDate);
        }
        if (maxDate) {
          setInitialEndDate(maxDate);
          setEndDate(maxDate);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch services date range:", error?.response?.data ?? error);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchDashboardTotalSales(startDate, endDate)
      .then((totalSales) => {
        if (!isCancelled) setApiTotalSales(totalSales);
      })
      .catch((error) => {
        console.error("Failed to fetch total sales:", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [startDate, endDate]);

  useEffect(() => {
    let isCancelled = false;

    fetchDashboardSalesByServiceSubcategory(startDate, endDate)
      .then((rows) => {
        if (!isCancelled) setSalesByServiceSubcategory(rows);
      })
      .catch((error) => {
        console.error("Failed to fetch service subcategory sales:", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [startDate, endDate]);

  useEffect(() => {
    let isCancelled = false;

    fetchDashboardSalesByDay(startDate, endDate)
      .then((dailySales) => {
        if (!isCancelled) setSalesByDay(dailySales);
      })
      .catch((error) => {
        console.error("Failed to fetch daily sales:", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [startDate, endDate]);

  useEffect(() => {
    let isCancelled = false;

    fetchDashboardTopSalesByService(startDate, endDate)
      .then((services) => {
        if (!isCancelled) setTopSalesByService(services);
      })
      .catch((error) => {
        console.error("Failed to fetch top sales by service:", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [startDate, endDate]);

  useEffect(() => {
    let isCancelled = false;

    fetchDashboardTotalOrders(startDate, endDate)
      .then((totalOrders) => {
        if (!isCancelled) setApiTotalOrders(totalOrders);
      })
      .catch((error) => {
        console.error("Failed to fetch total orders:", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [startDate, endDate]);

  const filteredOrders = useMemo(
    () => MOCK_ORDERS.filter((order) => order.date >= startDate && order.date <= endDate),
    [startDate, endDate]
  );

  const previousPeriodOrders = useMemo(() => {
    const { start, end } = shiftDateRange(startDate, endDate);
    return MOCK_ORDERS.filter((order) => order.date >= start && order.date <= end);
  }, [startDate, endDate]);

  const summary = useMemo(() => {
    const totalSales = filteredOrders.reduce((sum, o) => sum + o.sales, 0);
    const totalOrders = filteredOrders.reduce((sum, o) => sum + o.orders, 0);
    const previousSales = previousPeriodOrders.reduce((sum, o) => sum + o.sales, 0);
    const previousOrders = previousPeriodOrders.reduce((sum, o) => sum + o.orders, 0);

    const pctChange = (current: number, previous: number) =>
      previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      totalSales,
      totalOrders,
      totalSalesChangePct: pctChange(totalSales, previousSales),
      totalOrdersChangePct: pctChange(totalOrders, previousOrders),
    };
  }, [filteredOrders, previousPeriodOrders]);

  const grandTotalSales = salesByServiceSubcategory.reduce((sum, row) => sum + row.totalSales, 0);
  const grandTotalOrders = salesByServiceSubcategory.reduce((sum, row) => sum + row.totalOrders, 0);

  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start gap-4 lg:flex-row lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your sales and orders</p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
          <div className="flex h-13 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase text-gray-400">Start Date</span>
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value || initialStartDate)}
                className="text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex h-13 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase text-gray-400">End Date</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value || initialEndDate)}
                className="text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          {/*
          <button
            type="button"
            className="flex h-13 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Image src={adminAvatar} alt="Admin" className="h-8 w-8 rounded-full object-cover" />
            Admin
          </button>
          */}
        </div>
      </div>

      {/* Summary cards : Total Sales and Total Orders */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">
              {currencyFormatter.format(apiTotalSales ?? summary.totalSales)}
            </p>
            {/* <p className={`text-xs font-medium ${summary.totalSalesChangePct >= 0 ? "text-green-600" : "text-red-500"}`}>
              {summary.totalSalesChangePct >= 0 ? "↑" : "↓"} {Math.abs(summary.totalSalesChangePct).toFixed(1)}% vs. previous period
            </p> */}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-green-100 bg-green-50/60 p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {numberFormatter.format(apiTotalOrders ?? summary.totalOrders)}
            </p>
            {/* <p className={`text-xs font-medium ${summary.totalOrdersChangePct >= 0 ? "text-green-600" : "text-red-500"}`}>
              {summary.totalOrdersChangePct >= 0 ? "↑" : "↓"} {Math.abs(summary.totalOrdersChangePct).toFixed(1)}% vs. previous period
            </p> */}
          </div>
        </div>
      </div>

      {/* Charts: Top 5 Total Sales by Service Category and Total Sales by Day */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-800">Top 5 Total Sales by Service Category</h2>
            <ExportCsvButton
              onClick={() =>
                downloadCsv(
                  `top-sales-by-service_${startDate}_${endDate}.csv`,
                  ["Service", "Total Sales"],
                  topSalesByService.map((row) => [row.serviceName, row.totalSales])
                )
              }
            />
          </div>
          <BarChart
            height={300}
            layout="horizontal"
            dataset={topSalesByService}
            yAxis={[{ scaleType: "band", dataKey: "serviceName", width: 100 }]}
            series={[
              {
                dataKey: "totalSales",
                valueFormatter: (value) => currencyFormatter.format(value ?? 0),
                color: "#3366FF",
              },
            ]}
            grid={{ horizontal: true }}
            borderRadius={6}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-800">Total Sales by Day</h2>
            <ExportCsvButton
              onClick={() =>
                downloadCsv(
                  `sales-by-day_${startDate}_${endDate}.csv`,
                  ["Date", "Total Sales"],
                  salesByDay.map((row) => [String(row.date).slice(0, 10), row.totalSales])
                )
              }
            />
          </div>
          <LineChart
            height={300}
            dataset={salesByDay}
            xAxis={[{ scaleType: "point", dataKey: "date", valueFormatter: formatDayLabel }]}
            series={[
              {
                dataKey: "totalSales",
                valueFormatter: (value) => currencyFormatter.format(value ?? 0),
                color: "#3366FF",
                area: false,
                showMark: true,
              },
            ]}
            grid={{ horizontal: true }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800">
            Total Sales and Orders by Service Subcategory
          </h2>
          <ExportCsvButton
            onClick={() =>
              downloadCsv(
                `sales-by-service-subcategory_${startDate}_${endDate}.csv`,
                ["Service", "Service Subcategory", "Total Sales", "Total Orders"],
                salesByServiceSubcategory.map((row) => [
                  row.serviceName,
                  row.optionName,
                  row.totalSales,
                  row.totalOrders,
                ])
              )
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Service Subcategory</th>
                <th className="px-5 py-3 text-right font-medium">Total Sales</th>
                <th className="px-5 py-3 text-right font-medium">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {salesByServiceSubcategory.map((row) => (
                <tr key={`${row.serviceName}-${row.optionName}`} className="border-b border-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-800">{row.serviceName}</td>
                  <td className="px-5 py-3 text-blue-600">{row.optionName}</td>
                  <td className="px-5 py-3 text-right text-gray-700">
                    {currencyFormatter.format(row.totalSales)}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-700">
                    {numberFormatter.format(row.totalOrders)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-5 py-3 font-bold text-gray-900" colSpan={2}>
                  Total
                </td>
                <td className="px-5 py-3 text-right font-bold text-gray-900">
                  {currencyFormatter.format(grandTotalSales)}
                </td>
                <td className="px-5 py-3 text-right font-bold text-gray-900">
                  {numberFormatter.format(grandTotalOrders)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
