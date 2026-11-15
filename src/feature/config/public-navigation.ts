
export interface NavigationItem {
  label: string;
  href: string;
}

export const publicNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Manufacturing",
    href: "/manufacturing",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Contact",
    href: "/contact-us",
  },
];
