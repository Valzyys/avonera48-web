"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/live", label: "Live" },
  { href: "/members", label: "Member" },
  { href: "/theater", label: "Theater" },
  { href: "/news", label: "Berita" },
  { href: "/events", label: "Event" },
  { href: "/birthdays", label: "Ulang tahun" },
  { href: "/shipping", label: "Ongkir" },
];

export function Nav() {
  const path = usePathname();

  return (
    <nav className="nav">
      <div className="shell nav-inner">
        <Link href="/" className="brand" aria-label="Avonera48, ke beranda">
          avonera<span>48</span>
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={path === l.href || path.startsWith(l.href + "/")}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
