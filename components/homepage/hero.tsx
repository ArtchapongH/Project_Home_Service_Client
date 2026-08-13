import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <Image
        src="/images/landing/hero-technician.png"
        alt="ช่าง HomeServices พร้อมให้บริการดูแลบ้าน"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="hero-image"
      />
      <div className="page-container hero-content">
        <div className="hero-copy">
          <h1>เรื่องบ้าน...ให้เราช่วยดูแลคุณ</h1>
          <h2>“สะดวก ราคาคุ้มค่า เชื่อถือได้”</h2>
          <p>
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน
            <br />
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
          <Link href="/services" className="button button-primary">
            เช็คราคาบริการ
          </Link>
        </div>
      </div>
    </section>
  );
}
