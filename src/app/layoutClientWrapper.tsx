'use client';

import { usePathname } from "next/navigation";
import { Header } from "@/app/components/Header/Header";

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderRoutes = ["/"];
  const shouldShowHeader = !hideHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
}
