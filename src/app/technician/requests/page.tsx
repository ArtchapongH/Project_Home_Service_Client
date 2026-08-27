"use client";

import { AcceptRequestDialog } from "@/components/technician/requests/AcceptRequestDialog";
import { CurrentLocationBanner } from "@/components/technician/requests/CurrentLocationBanner";
import { RequestFilters } from "@/components/technician/requests/RequestFilters";
import { RequestListContent } from "@/components/technician/requests/RequestListContent";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { useTechnicianRequests } from "@/hooks/useTechnicianRequests";
import { formatThaiDateTime } from "@/utils/technician";

export default function TechnicianRequestsPage() {
  const {
    profile,
    requests,
    searchText,
    setSearchText,
    selectedServiceId,
    setSelectedServiceId,
    isLoadingRequests,
    activeRequestId,
    selectedRequest,
    errorMessage,
    successMessage,
    isUpdatingLocation,
    locationMessage,
    hasCoordinates,
    refreshLocation,
    selectRequestToAccept,
    closeAcceptDialog,
    confirmAcceptRequest,
    declineRequest,
  } = useTechnicianRequests();

  const isAvailable = profile?.isAvailable ?? false;

  return (
    <>
      <TechnicianPageHeader title="คำขอบริการซ่อม">
        {isAvailable ? (
          <RequestFilters
            services={profile?.services ?? []}
            selectedServiceId={selectedServiceId}
            searchText={searchText}
            onServiceChange={setSelectedServiceId}
            onSearchChange={setSearchText}
          />
        ) : null}
      </TechnicianPageHeader>

      <section className="p-4 md:p-8">
        {isAvailable ? (
          <CurrentLocationBanner
            address={profile?.address ?? null}
            hasCoordinates={hasCoordinates}
            loading={isUpdatingLocation}
            message={locationMessage}
            onRefresh={() => void refreshLocation()}
          />
        ) : null}

        {errorMessage ? (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        ) : null}

        <RequestListContent
          isAvailable={isAvailable}
          hasCoordinates={hasCoordinates}
          isLoading={isLoadingRequests}
          requests={requests}
          activeRequestId={activeRequestId}
          onAccept={selectRequestToAccept}
          onDecline={(request) => void declineRequest(request)}
        />
      </section>

      <AcceptRequestDialog
        open={Boolean(selectedRequest)}
        serviceName={selectedRequest?.serviceName ?? ""}
        scheduledAt={formatThaiDateTime(selectedRequest?.scheduledAt ?? null)}
        loading={Boolean(selectedRequest && activeRequestId === selectedRequest.orderId)}
        onClose={closeAcceptDialog}
        onConfirm={() => void confirmAcceptRequest()}
      />
    </>
  );
}
