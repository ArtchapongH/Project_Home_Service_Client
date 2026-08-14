"use client";

import React from "react";
import { ServiceProvider } from "../../../src/contexts/ServiceContext";

export default function AdminServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServiceProvider>{children}</ServiceProvider>;
}
