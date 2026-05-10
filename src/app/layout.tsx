import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://siddharthakumar.dev";
const SITE_NAME = "Siddhartha Kumar — Data Infrastructure Architect";
const SITE_DESCRIPTION =
  "Data Engineer with 5+ years architecting fault-tolerant, event-driven systems on AWS, Snowflake & Databricks. Currently at Tiger Analytics.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Siddhartha Kumar",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Siddhartha Kumar",
    "Data Engineer",
    "Data Infrastructure Architect",
    "AWS",
    "Snowflake",
    "Databricks",
    "Apache Airflow",
    "Apache Spark",
    "Tiger Analytics",
    "Bengaluru",
    "Distributed Systems",
    "Event-Driven Architecture",
    "Serverless",
    "ETL",
    "Data Engineering",
  ],
  authors: [{ name: "Siddhartha Kumar", url: SITE_URL }],
  creator: "Siddhartha Kumar",
  publisher: "Siddhartha Kumar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: "Siddhartha Kumar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@siddhartha_kumar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Siddhartha Kumar",
  jobTitle: "Data Infrastructure Architect",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: "shivsiddhartha187@hotmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/siddhartha-kumar",
    "https://www.linkedin.com/in/siddhartha--kumar/",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Tiger Analytics India Consulting Pvt. Ltd.",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Jaipur National University",
  },
  knowsAbout: [
    "Data Engineering",
    "AWS",
    "Snowflake",
    "Apache Airflow",
    "Distributed Systems",
    "Event-Driven Architecture",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
