"use client";

import { useEffect, useRef, useState } from "react";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { LocationControl } from "@/components/technician/settings/LocationControl";
import { useTechnician } from "@/contexts/TechnicianContext";
import { getPublicServices } from "@/services/publicServiceApi";
import { getTechnicianApiError, updateTechnicianSettings } from "@/services/technicianApi";
import type { PublicService } from "@/types/public-service";

export default function TechnicianSettingsPage() {
  const { profile, setProfile } = useTechnician();
  const initializedProfileId = useRef<string | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [firstName, setFirstName] = useState(profile?.first_name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [isAvailable, setIsAvailable] = useState(profile?.isAvailable ?? false);
  const [serviceIds, setServiceIds] = useState<string[]>(profile?.services.map((service) => service.id) ?? []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getPublicServices({ limit: 100 }).then(setServices).catch(() => setMessage("โหลดรายการบริการไม่สำเร็จ"));
  }, []);

  useEffect(() => {
    if (!profile || initializedProfileId.current === profile.technicianId) return;
    initializedProfileId.current = profile.technicianId;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
    setIsAvailable(profile.isAvailable);
    setServiceIds(profile.services.map((service) => service.id));
  }, [profile]);

  if (!profile) return null;

  const toggleService = (id: string) => {
    setServiceIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const cancelChanges = () => {
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
    setIsAvailable(profile.isAvailable);
    setServiceIds(profile.services.map((service) => service.id));
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateTechnicianSettings({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone || null,
        address: address || null,
        isAvailable,
        serviceIds,
      });
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
        <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-4">
          <button
            type="button"
            onClick={cancelChanges}
            disabled={saving}
            className="min-h-11 rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 md:px-6"
          >
            ยกเลิก
          </button>
          <button type="button" onClick={() => void save()} disabled={saving} className="min-h-11 rounded-lg bg-blue-600 px-4 py-2.5 text-sm text-white disabled:opacity-50 md:px-6">
            {saving ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
        </div>
      </TechnicianPageHeader>
      <section className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-sm md:p-8">
          {message && <div role="status" className="mb-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</div>}
          <h2 className="font-semibold">รายละเอียดบัญชี</h2>
          <div className="mt-5 space-y-6">
            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-center md:gap-4">
              <label htmlFor="firstName" className="text-sm text-gray-600">
                ชื่อ<span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-center md:gap-4">
              <label htmlFor="lastName" className="text-sm text-gray-600">
                นามสกุล<span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-center md:gap-4">
              <label htmlFor="phone" className="text-sm text-gray-600">
                เบอร์ติดต่อ<span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-start md:gap-4">
              <label htmlFor="address" className="text-sm text-gray-600 md:pt-3">
                ตำแหน่งที่อยู่ปัจจุบัน<span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <div>
                <LocationControl
                  profile={profile}
                  onUpdated={(location) => setProfile({ ...profile, ...location })}
                />
              </div>
            </div>
          </div>

          <hr className="my-7 border-gray-100" />
          <div className="grid gap-3 md:flex md:items-start md:gap-4">
            <span className="text-sm font-medium md:w-32.5 md:shrink-0">สถานะบัญชี</span>
            <label className="flex min-h-11 cursor-pointer items-start gap-3">
              <span className="relative mt-0.5 inline-flex">
                <input
                  type="checkbox"
                  role="switch"
                  checked={isAvailable}
                  onChange={(event) => setIsAvailable(event.target.checked)}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300 peer-focus-visible:ring-offset-2" />
                <span className="pointer-events-none absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </span>
              <span>
                <strong className="block text-sm">พร้อมให้บริการ</strong>
                <small className="text-gray-500">ระบบจะแสดงคำขอที่ตรงกับบริการของคุณ</small>
              </span>
            </label>
          </div>

          <hr className="my-7 border-gray-100" />
          <div className="grid gap-3 md:flex md:items-start md:gap-4">
            <span className="text-sm font-medium md:w-32.5 md:shrink-0">บริการที่รับซ่อม</span>
            <div className="grid flex-1 grid-cols-1 gap-3">
              {services.map((service) => (
                <label key={service.id} className="flex min-h-11 items-center gap-3 text-sm">
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
