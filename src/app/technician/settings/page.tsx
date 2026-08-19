"use client";

import { useEffect, useState } from "react";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { LocationControl } from "@/components/technician/settings/LocationControl";
import { useTechnician } from "@/contexts/TechnicianContext";
import { getPublicServices } from "@/services/publicServiceApi";
import { getTechnicianApiError, updateTechnicianSettings } from "@/services/technicianApi";
import type { PublicService } from "@/types/public-service";

export default function TechnicianSettingsPage() {
  const { profile, setProfile } = useTechnician();
  const [services, setServices] = useState<PublicService[]>([]);
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [isAvailable, setIsAvailable] = useState(profile?.isAvailable ?? false);
  const [serviceIds, setServiceIds] = useState<string[]>(profile?.services.map((service) => service.id) ?? []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getPublicServices({ limit: 100 }).then(setServices).catch(() => setMessage("โหลดรายการบริการไม่สำเร็จ"));
  }, []);

  if (!profile) return null;

  const toggleService = (id: string) => {
    setServiceIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateTechnicianSettings({ fullName, phone: phone || null, address: address || null, isAvailable, serviceIds });
      setProfile(updated);
      setMessage("บันทึกการตั้งค่าสำเร็จ");
    } catch (error) {
      setMessage(getTechnicianApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TechnicianPageHeader title="ตั้งค่าบัญชีผู้ใช้">
        <button type="button" onClick={() => void save()} disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm text-white disabled:opacity-50">
          {saving ? "กำลังบันทึก..." : "ยืนยัน"}
        </button>
      </TechnicianPageHeader>
      <section className="p-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm">
          {message && <div role="status" className="mb-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</div>}
          <h2 className="font-semibold">รายละเอียดบัญชี</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
            <label htmlFor="fullName" className="text-sm text-gray-600">ชื่อ-นามสกุล</label>
            <input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            <label htmlFor="phone" className="text-sm text-gray-600">เบอร์ติดต่อ</label>
            <input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            <label htmlFor="address" className="text-sm text-gray-600">ตำแหน่งที่อยู่ปัจจุบัน</label>
            <div>
              <textarea id="address" value={address} onChange={(event) => setAddress(event.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
              <div className="mt-3">
                <LocationControl
                  profile={profile}
                  onUpdated={(location) => setProfile({ ...profile, ...location })}
                />
              </div>
            </div>
          </div>

          <hr className="my-7 border-gray-100" />
          <div className="flex items-start gap-5">
            <span className="w-40 shrink-0 text-sm font-medium">สถานะบัญชี</span>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} className="h-5 w-5 accent-blue-600" />
              <span><strong className="block text-sm">พร้อมรับบริการ</strong><small className="text-gray-500">ระบบจะแสดงคำขอที่ตรงกับบริการของคุณ</small></span>
            </label>
          </div>

          <hr className="my-7 border-gray-100" />
          <div className="flex items-start gap-5">
            <span className="w-40 shrink-0 text-sm font-medium">บริการที่รับซ่อม</span>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service.id} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} className="h-4 w-4 accent-blue-600" />
                  {service.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
