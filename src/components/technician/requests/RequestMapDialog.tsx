"use client";

import dynamic from "next/dynamic";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { TechnicianJob, TechnicianProfile } from "@/types/technician";

const RequestLocationMap = dynamic(
  () => import("./RequestLocationMap").then((module) => module.RequestLocationMap),
  { ssr: false, loading: () => <p role="status" className="py-12 text-center">กำลังโหลดแผนที่...</p> },
);

export function RequestMapDialog({
  job,
  profile,
  onClose,
}: {
  job: TechnicianJob | null;
  profile: TechnicianProfile | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(job)} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="request-map-title">
      <DialogTitle id="request-map-title">แผนที่สถานที่ให้บริการ {job?.orderCode}</DialogTitle>
      <DialogContent>
        {job ? (
          <>
            <p className="mb-2 text-sm text-blue-700">● ตำแหน่งช่าง: {profile?.address || "ยังไม่มีที่อยู่"}</p>
            <p className="mb-4 text-sm text-green-700">● สถานที่ให้บริการ: {job.address || "ยังไม่มีที่อยู่"}</p>
            <RequestLocationMap
              technicianLatitude={profile?.latitude ?? null}
              technicianLongitude={profile?.longitude ?? null}
              serviceLatitude={job.serviceLatitude}
              serviceLongitude={job.serviceLongitude}
            />
          </>
        ) : null}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>ปิดแผนที่</Button></DialogActions>
    </Dialog>
  );
}
