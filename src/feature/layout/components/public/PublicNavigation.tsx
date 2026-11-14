import { publicNavigation } from "@/src/feature/config/public-navigation";
import Link from "next/link";


export function PublicNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-7 lg:flex"
    >
      {publicNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}