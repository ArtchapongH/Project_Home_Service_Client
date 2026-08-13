import Image from "next/image";

export function RecruitmentSection() {
  return (
    <section className="recruitment" aria-labelledby="recruitment-title">
      <div className="recruitment-image-wrap">
        <Image
          src="/images/landing/recruitment-technician-original.png"
          alt="ช่างมืออาชีพของ HomeServices"
          fill
          sizes="(max-width: 768px) 100vw, 36vw"
          className="recruitment-image"
        />
      </div>
      <div className="recruitment-copy">
        <div>
          <h2 id="recruitment-title">
            มาร่วมเป็นพนักงานซ่อม
            <br />
            กับ HomeServices
          </h2>
          <p>
            เข้ารับการฝึกอบรมที่ได้มาตรฐาน ฟรี!
            <br />
            และยังได้รับค่าตอบแทนที่มากขึ้นกว่าเดิม
          </p>
          <a href="mailto:job@homeservices.co">
            ติดต่อมาที่อีเมล: job@homeservices.co
          </a>
        </div>
        <Image
          src="/images/landing/Logo-Home2.png"
          alt=""
          width={420}
          height={420}
          unoptimized
          className="house-watermark"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
