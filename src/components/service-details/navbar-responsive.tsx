import React from "react";
import Link from "next/link";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { HomeServicesLogo } from "../layout/home-services-logo";
import { PaymentContext } from "@/app/service-details/layout";

export default function NavbarResponsive() {
	const payment = React.useContext(PaymentContext);
	return (
		<header className="relative z-10 h-14 border-b border-gray-200 bg-white shadow-[0_2px_12px_rgb(23_51_109/7%)] min-[801px]:h-18">
			<div className="mx-auto flex h-full w-[min(1140px,calc(100%-28px))] items-center justify-between min-[801px]:w-[min(1140px,calc(100%-48px))]">
				<div className="flex items-center gap-6 min-[801px]:gap-10">
					<Link href="/" className="w-fit" aria-label="กลับไปหน้าแรก">
						<HomeServicesLogo />
					</Link>
					<Link href="/services" className="text-sm font-medium text-gray-700">
						บริการของเรา
					</Link>
				</div>

        <div className="flex items-center gap-3 min-[801px]:gap-5">
          <Link
            href="/profile"
            className="flex shrink-0 items-center gap-2.5 rounded-full outline-offset-2 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="โปรไฟล์ของฉัน"
          >
            <span className="hidden whitespace-nowrap text-sm font-medium text-gray-700 min-[801px]:inline">
              {displayName}
            </span>
            <UserAvatar
              fullName={displayName}
              email={user?.email}
              avatarUrl={user?.avatarUrl}
            />
          </Link>

          <Link
            href="/notifications"
            className="flex size-9 items-center justify-center rounded-full bg-[#eef1f7] text-gray-600 transition hover:bg-blue-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 min-[801px]:size-10"
            aria-label="การแจ้งเตือน"
          >
            <NotificationsNoneRoundedIcon className="text-[20px] min-[801px]:text-[22px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}

