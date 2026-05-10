import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { profile } from "@/content/profile";
import { navigation } from "@/content/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border-subtle mt-12 md:mt-20">
      <div className="container-page py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-8">
          {/* Brand column */}
          <div className="md:col-span-7">
            <Link href="#hero" className="inline-flex items-center gap-3 group mb-5">
              <div className="w-10 h-10 rounded-md bg-brand-red flex items-center justify-center shadow-[0_0_20px_rgba(255,10,31,0.45)]">
                <span className="font-display font-bold text-sm text-white">
                  SK
                </span>
              </div>
              <div className="leading-tight">
                <p className="font-display font-semibold text-text-primary">
                  Siddhartha Kumar
                </p>
                <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                  Data Engineer &amp; Architect
                </p>
              </div>
            </Link>
            <p className="text-sm text-text-tertiary leading-relaxed max-w-md">
              Engineering data systems that scale beyond limits. Based in {profile.location}.
              <br className="hidden sm:inline" />
              Want to talk shop? Use the <Link href="#contact" className="text-brand-red hover:underline font-semibold">Contact</Link> section above.
            </p>
          </div>

          {/* Navigate column */}
          <div className="md:col-span-5">
            <h3 className="font-mono text-[11px] text-brand-red tracking-[0.2em] uppercase mb-4 font-bold">
              Navigate
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-red transition-colors duration-200"
                  >
                    <span className="font-mono text-[10px] text-text-muted group-hover:text-brand-red transition-colors">
                      {item.number}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted font-mono text-center sm:text-left">
            © {year} Siddhartha Kumar · Built with Next.js · Crafted with intent.
          </p>
          <Link
            href="#hero"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-tertiary hover:text-brand-red transition-colors"
          >
            Back to top <ArrowUp size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
