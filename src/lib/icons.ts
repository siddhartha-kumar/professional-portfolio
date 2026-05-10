/**
 * Icon resolver — maps tech/company names to logo URLs.
 *
 * Strategy:
 *   • Tech logos → Simple Icons CDN (https://cdn.simpleicons.org)
 *     - Free, no auth, returns SVG, supports brand color via /<slug>/<color>
 *   • Company logos → Google's favicon API
 *     - Works for any domain, no auth, returns PNG up to 256px
 *   • All requests use referrerPolicy="no-referrer" to minimize tracking.
 *   • Components handle 404s with graceful text fallbacks.
 */

const SIMPLE_ICONS = "https://cdn.simpleicons.org";
const GOOGLE_FAVICON = "https://www.google.com/s2/favicons";

export type TechIconResult = {
  url: string;
  brandColor: string;
  /** Visual treatment hint */
  accent?: "aws" | "azure" | "google" | "default";
};

/**
 * Map a tech/tool name to a Simple Icons slug + brand color.
 * Names are normalized (lowercased, trimmed) before lookup.
 */
const TECH_ICON_MAP: Record<string, { slug: string; color: string; accent?: TechIconResult["accent"] }> = {
  // ── Languages & general
  python: { slug: "python", color: "3776AB" },
  typescript: { slug: "typescript", color: "3178C6" },
  javascript: { slug: "javascript", color: "F7DF1E" },
  sql: { slug: "postgresql", color: "4169E1" },
  "shell scripting": { slug: "gnubash", color: "4EAA25" },

  // ── Python ecosystem
  pyspark: { slug: "apachespark", color: "E25A1C" },
  pandas: { slug: "pandas", color: "150458" },
  numpy: { slug: "numpy", color: "013243" },
  flask: { slug: "flask", color: "FFFFFF" },
  boto3: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },

  // ── REST / web
  "rest apis": { slug: "openapiinitiative", color: "6BA539" },

  // ── AWS — generic
  aws: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  "amazon web services": { slug: "amazonwebservices", color: "FF9900", accent: "aws" },

  // ── AWS services (Simple Icons coverage)
  lambda: { slug: "awslambda", color: "FF9900", accent: "aws" },
  "aws lambda": { slug: "awslambda", color: "FF9900", accent: "aws" },
  "step functions": { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  "aws step functions": { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  dynamodb: { slug: "amazondynamodb", color: "4053D6", accent: "aws" },
  "amazon dynamodb": { slug: "amazondynamodb", color: "4053D6", accent: "aws" },
  s3: { slug: "amazons3", color: "569A31", accent: "aws" },
  "amazon s3": { slug: "amazons3", color: "569A31", accent: "aws" },
  ec2: { slug: "amazonec2", color: "FF9900", accent: "aws" },
  "amazon ec2": { slug: "amazonec2", color: "FF9900", accent: "aws" },
  athena: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  "aws athena": { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  glue: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  emr: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  "aws emr": { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  "api gateway": { slug: "amazonapigateway", color: "FF4F8B", accent: "aws" },
  cloudwatch: { slug: "amazoncloudwatch", color: "FF4F8B", accent: "aws" },
  eventbridge: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  sns: { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  sqs: { slug: "amazonsqs", color: "FF4F8B", accent: "aws" },
  "sns / sqs": { slug: "amazonwebservices", color: "FF9900", accent: "aws" },
  iam: { slug: "amazoniam", color: "DD344C", accent: "aws" },
  "aurora postgresql": { slug: "amazonrds", color: "527FFF", accent: "aws" },
  "amazon aurora": { slug: "amazonrds", color: "527FFF", accent: "aws" },

  // ── Data platforms
  snowflake: { slug: "snowflake", color: "29B5E8" },
  postgresql: { slug: "postgresql", color: "4169E1" },
  hive: { slug: "apachehive", color: "FDEE21" },
  "apache hive": { slug: "apachehive", color: "FDEE21" },
  hdfs: { slug: "apachehadoop", color: "66CCFF" },

  // ── Distributed systems
  "apache spark": { slug: "apachespark", color: "E25A1C" },
  spark: { slug: "apachespark", color: "E25A1C" },
  "apache airflow": { slug: "apacheairflow", color: "017CEE" },
  airflow: { slug: "apacheairflow", color: "017CEE" },
  kafka: { slug: "apachekafka", color: "FFFFFF" },

  // ── DevOps & tooling
  docker: { slug: "docker", color: "2496ED" },
  git: { slug: "git", color: "F05032" },
  github: { slug: "github", color: "FFFFFF" },
  gitlab: { slug: "gitlab", color: "FC6D26" },
  "azure devops": { slug: "azuredevops", color: "0078D7", accent: "azure" },
  "ci/cd": { slug: "githubactions", color: "2088FF" },
  terraform: { slug: "terraform", color: "844FBA" },
  grafana: { slug: "grafana", color: "F46800" },
  jira: { slug: "jira", color: "0052CC" },
  kubernetes: { slug: "kubernetes", color: "326CE5" },

  // ── Analytics & BI
  "power bi": { slug: "powerbi", color: "F2C811" },
  powerbi: { slug: "powerbi", color: "F2C811" },
  tableau: { slug: "tableau", color: "E97627" },
  databricks: { slug: "databricks", color: "FF3621" },
  "dataiku dss": { slug: "dataiku", color: "2AB1AC" },
  dataiku: { slug: "dataiku", color: "2AB1AC" },

  // ── Microsoft / cloud
  azure: { slug: "microsoftazure", color: "0078D4", accent: "azure" },
  "microsoft azure": { slug: "microsoftazure", color: "0078D4", accent: "azure" },
  google: { slug: "google", color: "4285F4", accent: "google" },
  "google cloud": { slug: "googlecloud", color: "4285F4", accent: "google" },
};

const CONCEPT_FALLBACK: Record<string, string> = {
  // Things without a specific brand icon — use category-style chip
  "iot sensors": "📡",
  "root cause analysis": "🔍",
  automation: "⚙️",
  "data lakes": "💧",
  "data warehouses": "🏛️",
  "event-driven architecture": "⚡",
  microservices: "🧩",
  "message queues": "📬",
  "etl / elt pipelines": "🔄",
  "etl/elt pipelines": "🔄",
  "dimensional modeling": "📐",
  olap: "📊",
  "scd type 2": "🕒",
  "schema design": "🗂️",
  partitioning: "🧮",
  indexing: "🔖",
  "data quality": "✅",
  "agile / scrum": "🏃",
  "agile/scrum": "🏃",
};

/**
 * Resolve a tech/tool name to an icon URL.
 * Returns null if no logo is available — caller renders text-only fallback.
 */
export function getTechIcon(name: string): TechIconResult | null {
  const key = name.trim().toLowerCase();
  const entry = TECH_ICON_MAP[key];
  if (!entry) return null;
  return {
    url: `${SIMPLE_ICONS}/${entry.slug}/${entry.color}`,
    brandColor: `#${entry.color}`,
    accent: entry.accent ?? "default",
  };
}

/** Optional concept emoji fallback for items without a brand logo. */
export function getConceptFallback(name: string): string | null {
  return CONCEPT_FALLBACK[name.trim().toLowerCase()] ?? null;
}

/** Resolve a domain to a Google favicon URL. */
export function getCompanyLogo(domain: string, size: 64 | 128 | 256 = 128): string {
  return `${GOOGLE_FAVICON}?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

/** Map cert issuer name to a logo domain. */
export const ISSUER_DOMAINS: Record<string, string> = {
  "Astronomer": "astronomer.io",
  "Amazon Web Services": "aws.amazon.com",
  Microsoft: "microsoft.com",
  Databricks: "databricks.com",
  Google: "google.com",
  Snowflake: "snowflake.com",
};

/** Map company name to a logo domain. */
export const COMPANY_DOMAINS: Record<string, string> = {
  "Tiger Analytics": "tigeranalytics.com",
  "Tiger Analytics India Consulting Pvt. Ltd.": "tigeranalytics.com",
  "Futurense Technologies": "futurense.com",
  "Futurense Technologies Pvt. Ltd.": "futurense.com",
  "Bosch Limited": "bosch.com",
  "Bosch Limited (Robert Bosch India)": "bosch.com",
};
