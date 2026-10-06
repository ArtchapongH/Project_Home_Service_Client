import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RequestLocationMapProps } from "./RequestLocationMap";
import { RequestMapDialog } from "./RequestMapDialog";
import { INITIAL_REQUESTS } from "@/mocks/technicianRequestFixtures";
import type { TechnicianProfile } from "@/types/technician";

vi.mock("next/dynamic", () => ({
  default: () => function Map(props: RequestLocationMapProps) {
    return <div data-testid="map-coordinates">{JSON.stringify(props)}</div>;
  },
}));

const job = INITIAL_REQUESTS[0];
const profile: TechnicianProfile = {
  technicianId: "1", userId: "2", email: "tech@example.com", fullName: "ช่าง",
  phone: null, address: "ที่อยู่ช่าง", isAvailable: true, latitude: 13.81, longitude: 100.55,
  locationUpdatedAt: "2026-10-06T04:00:00Z", services: [],
};

describe("request map dialog", () => {
  it("passes the shared profile and selected job coordinates, updates, closes and reopens", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<RequestMapDialog job={job} profile={profile} onClose={onClose} />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName(`แผนที่สถานที่ให้บริการ ${job.orderCode}`);
    expect(JSON.parse(screen.getByTestId("map-coordinates").textContent!)).toEqual({
      technicianLatitude: profile.latitude, technicianLongitude: profile.longitude,
      serviceLatitude: job.serviceLatitude, serviceLongitude: job.serviceLongitude,
    });
    rerender(<RequestMapDialog job={job} profile={{ ...profile, latitude: 13.83 }} onClose={onClose} />);
    expect(JSON.parse(screen.getByTestId("map-coordinates").textContent!).technicianLatitude).toBe(13.83);
    fireEvent.click(screen.getByRole("button", { name: "ปิดแผนที่" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<RequestMapDialog job={null} profile={profile} onClose={onClose} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByTestId("map-coordinates")).not.toBeInTheDocument();
    const nextJob = { ...job, orderCode: "HS-OTHER", serviceLatitude: 13.84, serviceLongitude: 100.57 };
    rerender(<RequestMapDialog job={nextJob} profile={profile} onClose={onClose} />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("แผนที่สถานที่ให้บริการ HS-OTHER");
    expect(JSON.parse(screen.getByTestId("map-coordinates").textContent!).serviceLatitude).toBe(13.84);
  });
});
