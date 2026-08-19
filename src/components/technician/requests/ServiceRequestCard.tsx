import type { TechnicianJob } from "@/types/technician";
import { DirectionsLink } from "@/components/technician/shared/DirectionsLink";
import { formatBaht, formatThaiDateTime } from "@/utils/technician";

export function ServiceRequestCard({
  job,
  disabled,
  onAccept,
  onDecline,
}: {
  job: TechnicianJob;
  disabled: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const itemText = job.items.length
    ? job.items.map((item) => `${item.optionName} ${item.quantity} ${item.unit}`).join(", ")
    : job.serviceName;
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-gray-900">{job.serviceName}</h2>
          <p className="mt-1 text-xs text-gray-500">รหัสคำสั่งซื้อ {job.orderCode}</p>
        </div>
        <p className="text-xs font-medium text-blue-600">วันเวลานัดหมาย {formatThaiDateTime(job.scheduledAt)}</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[120px_1fr]">
        <dt className="text-gray-500">รายการ</dt><dd>{itemText}</dd>
        <dt className="text-gray-500">ราคารวม</dt><dd>{formatBaht(job.totalPrice)}</dd>
        <dt className="text-gray-500">สถานที่</dt>
        <dd><p>{job.address || "ยังไม่ระบุ"}</p><DirectionsLink latitude={job.serviceLatitude} longitude={job.serviceLongitude} address={job.address} /></dd>
      </dl>
      <div className="mt-4 flex justify-end gap-3">
        <button type="button" onClick={onDecline} disabled={disabled} className="rounded-lg border border-blue-600 px-5 py-2 text-sm text-blue-600 disabled:opacity-50">ปฏิเสธ</button>
        <button type="button" onClick={onAccept} disabled={disabled} className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white disabled:opacity-50">รับงาน</button>
      </div>
    </article>
  );
}
