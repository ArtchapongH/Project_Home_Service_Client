import Image from "next/image";

export function HomeServicesLogo() {
  return (
    <span className="brand-logo">
      <Image
        src="/images/landing/Logo-Home.png"
        alt=""
        width={36}
        height={36}
        unoptimized
        className="brand-logo-image"
      />
      HomeServices
    </span>
  );
}
