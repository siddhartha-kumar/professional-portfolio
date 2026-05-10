export type NavItem = {
  id: string;
  label: string;
  href: string;
  number: string;
};

export const navigation: NavItem[] = [
  { id: "about", label: "About", href: "#about", number: "01" },
  { id: "metrics", label: "Impact", href: "#metrics", number: "02" },
  { id: "projects", label: "Projects", href: "#projects", number: "03" },
  { id: "experience", label: "Experience", href: "#experience", number: "04" },
  { id: "stack", label: "Stack", href: "#stack", number: "05" },
  { id: "certifications", label: "Credentials", href: "#certifications", number: "06" },
  { id: "github", label: "GitHub", href: "#github", number: "07" },
  { id: "contact", label: "Contact", href: "#contact", number: "08" },
];
