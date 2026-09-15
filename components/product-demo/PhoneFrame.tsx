import type { ReactNode } from "react";
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={"phone " + className}><div className="phone-status" aria-hidden="true"><span>9:41</span><span className="phone-island"/><span>▴ ▰</span></div>{children}<div className="phone-home-indicator" aria-hidden="true"/></div>;
}
