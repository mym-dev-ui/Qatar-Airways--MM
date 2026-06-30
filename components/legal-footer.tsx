"use client";

import Link from "next/link";
import { siteContent } from "@/lib/site-content";

export function LegalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#d9c3cc]/60 bg-[#3f0d29] text-white" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1fr_auto] md:px-8">
        <div className="text-right">
          <h3 className="text-xl font-bold">{siteContent.brand.name}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">
            {siteContent.brand.description}
          </p>
          <div className="mt-4 text-sm text-white/70">
            <div>{siteContent.brand.phone}</div>
            <div>{siteContent.brand.email}</div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 text-sm md:items-end">
          <Link href="/privacy" className="text-white/80 transition hover:text-white">
            سياسة الخصوصية
          </Link>
          <Link href="/cookies" className="text-white/80 transition hover:text-white">
            سياسة الكوكيز
          </Link>
          <Link href="/check" className="text-white/80 transition hover:text-white">
            إدارة الحجز
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 md:px-8">
        © {currentYear} {siteContent.brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
