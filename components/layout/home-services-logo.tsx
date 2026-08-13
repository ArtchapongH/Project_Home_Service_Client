import Image from "next/image";

export function HomeServicesLogo() {
  return (
    <span className="inline-flex h-7 items-center gap-2 text-lg leading-none font-medium text-[#336df2] min-[801px]:h-9 min-[801px]:text-2xl">
      <Image
        src="/images/landing/Logo-Home.png"
        alt=""
        width={36}
        height={36}
        unoptimized
        className="size-7 object-contain min-[801px]:size-9"
      />
      HomeServices
    </span>
  );
}
