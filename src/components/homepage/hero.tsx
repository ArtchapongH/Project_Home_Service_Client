import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[610px] overflow-hidden bg-[#eaf1ff] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,#eaf1ff_0%,#eaf1ff_46%,transparent_74%)] after:content-[''] min-[801px]:min-h-[430px] min-[801px]:after:hidden">
      <Image
        src="/images/landing/hero-technician.png"
        alt="ช่าง HomeServices พร้อมให้บริการดูแลบ้าน"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-contain object-bottom min-[801px]:object-[calc(50%+330px)_bottom]"
      />
      <div className="relative z-[1] mx-auto flex min-h-[610px] w-[min(1140px,calc(100%-32px))] items-start pt-[54px] min-[801px]:min-h-[430px] min-[801px]:w-[min(1140px,calc(100%-48px))] min-[801px]:items-center min-[801px]:pt-0">
        <div className="w-full pb-1 text-center min-[801px]:w-[57%] min-[801px]:text-left">
          <h1 className="mb-2 text-[29px] leading-[1.18] font-extrabold tracking-[-1.5px] text-blue-700 min-[421px]:text-[34px] min-[801px]:text-[clamp(32px,4vw,52px)]">เรื่องบ้าน...ให้เราช่วยดูแลคุณ</h1>
          <h2 className="mb-7 text-lg font-bold min-[421px]:text-[21px] min-[801px]:text-[clamp(22px,2.5vw,31px)]">“สะดวก ราคาคุ้มค่า เชื่อถือได้”</h2>
          <p className="mb-[34px] text-sm leading-[1.8] text-[#697386] min-[801px]:text-base [&_br]:max-[420px]:hidden">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน
            <br />
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
          <Link href="/services" className="inline-flex min-h-[42px] items-center justify-center rounded-[7px] bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-blue-700">
            เช็คราคาบริการ
          </Link>
        </div>
      </div>
    </section>
  );
}
