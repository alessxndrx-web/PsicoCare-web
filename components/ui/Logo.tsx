import Image from "next/image";
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return <Image src={tone === "dark" ? "/brand/logo-light.svg" : "/brand/logo-purple.svg"} width={126} height={70} alt="PsicoCare" className="brand-logo" priority />;
}
