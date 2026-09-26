import Link from "next/link";

const LINK_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Evaluation", href: "#" },
      { label: "Monitoring", href: "#" },
      { label: "Alignment", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Research", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="bg-footer border-t border-border-light px-6 py-16 md:py-24"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-24">
          {/* Wordmark */}
          <div>
            <Link
              href="/"
              className="font-heading text-[20px] font-[500] tracking-[-0.5px] text-text-heading"
            >
              Arcline Labs
            </Link>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-16 md:gap-24">
            {LINK_COLUMNS.map((col) => (
              <div key={col.title} className="min-w-[120px]">
                <p className="text-[12px] uppercase tracking-[0.08em] text-text-muted mb-4 font-body">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-text hover:text-accent transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal line */}
        <p className="text-[12px] text-text-muted mt-16 pt-8 border-t border-border-light">
          © {new Date().getFullYear()} Arcline Labs, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
