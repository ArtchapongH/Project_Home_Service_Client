"use client";

import { useEffect, useRef, useState } from "react";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { LocationControl } from "@/components/technician/settings/LocationControl";
import { useTechnician } from "@/contexts/TechnicianContext";
import { getPublicServices } from "@/services/publicServiceApi";
import { getTechnicianApiError, updateTechnicianSettings } from "@/services/technicianApi";
import type { PublicService } from "@/types/public-service";
import type { TechnicianProfile } from "@/types/technician";

const PHONE_PATTERN = /^0[0-9]{8,9}$/;

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
};

function namePartsFromProfile(profile: TechnicianProfile) {
  const first = (profile.firstName ?? profile.first_name ?? "").trim();
  const last = (profile.lastName ?? profile.last_name ?? "").trim();
  if (first || last) return { firstName: first, lastName: last };

  const parts = (profile.fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export default function TechnicianSettingsPage() {
  const { profile, setProfile } = useTechnician();
  const initializedProfileId = useRef<string | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [isAvailable, setIsAvailable] = useState(profile?.isAvailable ?? false);
  const [serviceIds, setServiceIds] = useState<string[]>(profile?.services.map((service) => service.id) ?? []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    void getPublicServices({ limit: 100 }).then(setServices).catch(() => {
      setIsError(true);
      setMessage("โหลดรายการบริการไม่สำเร็จ");
    });
  }, []);

  useEffect(() => {
    if (!profile || initializedProfileId.current === profile.technicianId) return;
    initializedProfileId.current = profile.technicianId;
    const names = namePartsFromProfile(profile);
    setFirstName(names.firstName);
    setLastName(names.lastName);
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
    setIsAvailable(profile.isAvailable);
    setServiceIds(profile.services.map((service) => service.id));
  }, [profile]);

  if (!profile) return null;

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const applyProfileToForm = () => {
    const names = namePartsFromProfile(profile);
    setFirstName(names.firstName);
    setLastName(names.lastName);
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
    setIsAvailable(profile.isAvailable);
    setServiceIds(profile.services.map((service) => service.id));
    setMessage(null);
    setIsError(false);
    setFieldErrors({});
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!firstName.trim()) errors.firstName = "กรุณากรอกชื่อ";
    if (!lastName.trim()) errors.lastName = "กรุณากรอกนามสกุล";
    if (!phone.trim()) {
      errors.phone = "กรุณากรอกเบอร์ติดต่อ";
    } else if (!PHONE_PATTERN.test(phone.trim())) {
      errors.phone = "กรุณากรอกเบอร์ติดต่อให้ถูกต้อง (เช่น 0890002345)";
    }
    if (!address.trim()) errors.address = "กรุณากรอกตำแหน่งที่อยู่ปัจจุบัน";
    return errors;
  };

  const toggleService = (id: string) => {
    setServiceIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const save = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsError(true);
      setMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setSaving(true);
    setMessage(null);
    setIsError(false);
    setFieldErrors({});
    try {
      const updated = await updateTechnicianSettings({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        isAvailable,
        serviceIds,
      });
      setProfile(updated);
      setIsError(false);
      setMessage("บันทึกการตั้งค่าสำเร็จ");
    } catch (error) {
      setIsError(true);
      setMessage(getTechnicianApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <TechnicianPageHeader title="ตั้งค่าบัญชีผู้ใช้">
        <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-4">
          <button
            type="button"
            onClick={applyProfileToForm}
            disabled={saving}
            className="min-h-11 rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 md:px-6"
          >
            ยกเลิก
          </button>
          <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-blue-600 px-4 py-2.5 text-sm text-white disabled:opacity-50 md:px-6">
            {saving ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
        </div>
      </TechnicianPageHeader>
      <section className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-sm md:p-8">
          {message && (
            <div
              role="status"
              className={`mb-5 rounded-lg p-3 text-sm ${isError ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}
            >
              {message}
            </div>
          )}
          <h2 className="font-semibold">รายละเอียดบัญชี</h2>
          <div className="mt-5 space-y-6">
            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-start md:gap-4">
              <label htmlFor="firstName" className="text-sm text-gray-600 md:pt-3">
                ชื่อ<span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    clearFieldError("firstName");
                  }}
                  required
                  aria-invalid={Boolean(fieldErrors.firstName)}
                  aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                  className={`min-h-11 w-full min-w-0 rounded-lg border px-4 text-sm outline-none focus:border-blue-500 ${
                    fieldErrors.firstName ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {fieldErrors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-start md:gap-4">
              <label htmlFor="lastName" className="text-sm text-gray-600 md:pt-3">
                นามสกุล<span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                    clearFieldError("lastName");
                  }}
                  required
                  aria-invalid={Boolean(fieldErrors.lastName)}
                  aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                  className={`h-11 w-full rounded-lg border px-4 text-sm outline-none focus:border-blue-500 ${
                    fieldErrors.lastName ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {fieldErrors.lastName && (
                  <p id="lastName-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-start md:gap-4">
              <label htmlFor="phone" className="text-sm text-gray-600 md:pt-3">
                เบอร์ติดต่อ<span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    clearFieldError("phone");
                  }}
                  required
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  className={`h-11 w-full rounded-lg border px-4 text-sm outline-none focus:border-blue-500 ${
                    fieldErrors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {fieldErrors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-[130px_268px_1fr] md:items-start md:gap-4">
              <label htmlFor="address" className="text-sm text-gray-600 md:pt-3">
                ตำแหน่งที่อยู่ปัจจุบัน<span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="address"
                  name="address"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                    clearFieldError("address");
                  }}
                  required
                  aria-invalid={Boolean(fieldErrors.address)}
                  aria-describedby={fieldErrors.address ? "address-error" : undefined}
                  className={`h-11 w-full rounded-lg border px-4 text-sm outline-none focus:border-blue-500 ${
                    fieldErrors.address ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {fieldErrors.address && (
                  <p id="address-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.address}
                  </p>
                )}
              </div>
              <div>
                <LocationControl
                  profile={profile}
                  onUpdated={(location) => {
                    setProfile({ ...profile, ...location });
                    if (location.address != null) {
                      setAddress(location.address);
                      clearFieldError("address");
                    }
                  }}
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
    </form>
  );
}
