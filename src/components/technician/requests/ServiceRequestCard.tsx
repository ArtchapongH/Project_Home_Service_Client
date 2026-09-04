import type { TechnicianJob } from "@/types/technician";
import { DirectionsLink } from "@/components/technician/shared/DirectionsLink";
import { formatBaht, formatJobItemSummary, formatThaiDateTime, getCustomerNotes } from "@/utils/technician";

interface ServiceRequestCardProps {
  job: TechnicianJob;
  disabled: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function ServiceRequestCard({
  job,
  disabled,
  onAccept,
  onDecline,
}: ServiceRequestCardProps) {
  const itemSummary = formatJobItemSummary(job);
  const customerNotes = getCustomerNotes(job.notes);

  return (
    <article className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{job.serviceName}</h2>
          <p className="mt-1 break-all text-base text-gray-500">
            รหัสคำสั่งซื้อ {job.orderCode}
          </p>
        </div>
        <p className="text-lg font-medium text-blue-600">
          วันเวลานัดหมาย {formatThaiDateTime(job.scheduledAt)}
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-3 text-lg sm:grid-cols-[120px_1fr] sm:gap-y-2">
        <dt className="text-gray-500">รายการ</dt>
        <dd className="min-w-0 break-words">
          <p>{itemSummary}</p>
          {customerNotes ? <p className="mt-1 text-base text-gray-700">{customerNotes}</p> : null}
        </dd>
        <dt className="text-gray-500">ราคารวม</dt>
        <dd>{formatBaht(job.totalPrice)}</dd>
        <dt className="text-gray-500">สถานที่</dt>
        <dd className="min-w-0 break-words">
          <p>{job.address || "ยังไม่ระบุ"}</p>
          <DirectionsLink
            latitude={job.serviceLatitude}
            longitude={job.serviceLongitude}
            address={job.address}
          />
        </dd>
      </dl>
      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onDecline}
          disabled={disabled}
          className="min-h-16 flex-1 rounded-lg border border-blue-600 px-10 py-4 text-lg text-blue-600 disabled:opacity-50 md:min-h-0 md:flex-none"
        >
          ปฏิเสธ
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={disabled}
          className="min-h-11 flex-1 rounded-lg bg-blue-600 px-10 py-4 text-lg text-white disabled:opacity-50 md:min-h-0 md:flex-none"
        >
          รับงาน
        </button>
      </div>
    </article>
  );
}
