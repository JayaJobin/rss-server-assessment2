"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumbs.module.css";

const LABELS: Record<string, string> = {
  feeds: "Feeds",
  about: "About",
  settings: "Settings",
};

interface Crumb {
  href: string;
  label: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs: Crumb[] = [{ href: "/", label: "Home" }];
  let pathSoFar = "";
  segments.forEach((segment) => {
    pathSoFar += `/${segment}`;
    crumbs.push({
      href: pathSoFar,
      label: LABELS[segment] || segment,
    });
  });

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.trail}>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className={styles.node}>
              {isLast ? (
                <span aria-current="page" className={styles.current}>
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
              {!isLast && <span className={styles.pulse} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
