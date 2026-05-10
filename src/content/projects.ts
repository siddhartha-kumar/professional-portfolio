export type ProjectCategory = "production" | "platform" | "foundation";

export type Project = {
  id: string;
  title: string;
  client: string;
  clientType: string;
  period: string;
  category: ProjectCategory;
  tagline: string;
  techStack: string[];
  problem: string;
  approach: string;
  decisions?: string[];
  outcomes: string[];
  accentColor: "cyan" | "violet" | "green";
  featured?: boolean;
};

export const projectCategories: Record<ProjectCategory, { title: string; description: string }> = {
  production: {
    title: "Production Systems",
    description: "Mission-critical infrastructure running in production today.",
  },
  platform: {
    title: "Internal Platforms",
    description: "Reusable infrastructure that compounds across teams.",
  },
  foundation: {
    title: "Foundations",
    description: "Earlier work that shaped the systems thinking.",
  },
};

export const projects: Project[] = [
  {
    id: "pos-pipeline",
    title: "POS Messaging Pipeline",
    client: "Quick Service Restaurant Client",
    clientType: "QSR · Global Restaurant Chain",
    period: "Oct 2025 – Present",
    category: "production",
    tagline:
      "Serverless event-driven backbone processing transaction data across 15+ markets.",
    techStack: [
      "AWS Step Functions",
      "Lambda",
      "DynamoDB",
      "EventBridge",
      "S3",
      "CloudWatch",
      "Aurora PostgreSQL",
    ],
    problem:
      "Restaurant POS systems across 15+ countries needed a unified, low-latency data pipeline. Existing PostgreSQL-based ingestion couldn't keep up with peak load — transactions were missing the 3-minute SLA, and engineering was firefighting weekly incidents.",
    approach:
      "Architected a fully serverless event-driven pipeline using AWS Step Functions Express Workflows, optimized for high-throughput burst loads. Migrated hot paths from PostgreSQL to DynamoDB with carefully designed partition keys and GSIs. Implemented atomic counter systems for race-condition-free distributed key generation.",
    decisions: [
      "Express Workflows over Standard: 100ms execution, no need for long-running state",
      "DynamoDB for hot path, Aurora retained for ODS: best of both worlds",
      "Idempotency tracking via Lambda Powertools: dedupe at the source",
      "Soft rejection + DLQ + exponential backoff: nothing silently fails",
    ],
    outcomes: [
      "8,000+ concurrent executions sustained",
      "99.9% messages processed within 3-min SLA",
      "Zero race conditions in 6+ months of production",
      "On-call incidents reduced 60%",
    ],
    accentColor: "cyan",
    featured: true,
  },
  {
    id: "customer-portal",
    title: "Customer Portal",
    client: "Logistics Client",
    clientType: "Logistics · Multi-tenant SaaS",
    period: "Sep 2025 – Oct 2025",
    category: "production",
    tagline:
      "Multi-tenant shipment tracking serving 50+ enterprise clients with sub-minute freshness.",
    techStack: [
      "AWS Athena",
      "DynamoDB",
      "Lambda",
      "API Gateway",
      "S3",
      "CloudWatch",
    ],
    problem:
      "A multi-tenant shipment-tracking portal was serving 50+ enterprise clients with P95 response times of 8 seconds. Athena queries were scanning unpartitioned data, costs were unpredictable, and tenants were escalating.",
    approach:
      "Re-architected the query layer with intelligent partitioning by tenant + date, introduced result caching at the API Gateway edge, and rewrote the hottest Athena queries to leverage projection pushdown.",
    outcomes: [
      "P95 latency: 8s → under 2s (75% reduction)",
      "Athena query costs reduced 60%",
      "Support escalations down 40%",
    ],
    accentColor: "green",
  },
  {
    id: "model-repository",
    title: "Model Repository",
    client: "Pharmaceutical Client",
    clientType: "Pharmaceutical · ML Platform",
    period: "Oct 2024 – Sep 2025",
    category: "production",
    tagline:
      "Centralized ML registry compressing 14-day deployments into 2 — for 50+ data scientists.",
    techStack: [
      "Python",
      "Flask",
      "Snowflake",
      "Dataiku DSS",
      "REST APIs",
      "SQL",
    ],
    problem:
      "A pharmaceutical client's data science team was losing two weeks per model rollout — manual approvals, scattered artifacts, no lineage. With 50+ data scientists and tight regulatory requirements, the bottleneck was killing time-to-insight.",
    approach:
      "Built a centralized ML model registry with Snowflake-backed metadata, automated lineage tracking, and version control. Exposed everything through Flask REST microservices orchestrated via Dataiku, so scientists could self-serve while the platform enforced compliance.",
    outcomes: [
      "Deployment time: 14 days → 2 days (85% improvement)",
      "Auditable lineage for every model version",
      "50+ data scientists self-serving without ops involvement",
      "Full pharmaceutical regulatory compliance maintained",
    ],
    accentColor: "violet",
    featured: true,
  },
  {
    id: "data-fabric",
    title: "Data Fabric Platform",
    client: "Internal Asset",
    clientType: "Internal · Reusable Infrastructure",
    period: "Internal Project",
    category: "platform",
    tagline:
      "Reusable data platform with Airflow-orchestrated PySpark pipelines and standardized contracts.",
    techStack: [
      "AWS",
      "Databricks",
      "Apache Airflow",
      "PySpark",
      "Grafana",
      "PostgreSQL",
    ],
    problem:
      "Every new data project at Tiger was rebuilding pipelines from scratch. Schema drift, inconsistent observability, weeks of bootstrap work per engagement. We needed a platform, not another pipeline.",
    approach:
      "Engineered a reusable Data Fabric — Airflow-orchestrated PySpark with standardized data contracts, automated schema evolution, and Grafana observability baked in. Made it possible to spin up a new pipeline in hours instead of weeks.",
    outcomes: [
      "60% faster processing for downstream ML applications",
      "50% MTTR reduction via real-time observability",
      "Standardized contracts adopted across multiple client engagements",
    ],
    accentColor: "cyan",
  },
  {
    id: "marketing-mix",
    title: "Marketing Mix Automation",
    client: "Internal API",
    clientType: "Internal · Workflow Automation",
    period: "Internal Project",
    category: "platform",
    tagline:
      "Production APIs eliminating 90% of manual intervention in marketing-mix research.",
    techStack: ["Python", "SQL", "Snowflake", "REST APIs"],
    problem:
      "Marketing-mix research workflows were heavily manual: analysts running ad-hoc SQL, copying results into spreadsheets, emailing stakeholders. Slow, error-prone, and not auditable.",
    approach:
      "Built production-grade Python APIs over Snowflake to expose research workflows as repeatable services. Standardized inputs/outputs, added versioning and observability.",
    outcomes: [
      "80% improvement in operational efficiency",
      "90% reduction in manual intervention",
      "Auditable workflow lineage for every research run",
    ],
    accentColor: "violet",
  },
  {
    id: "etl-pocs",
    title: "Distributed ETL POCs",
    client: "Futurense Clients",
    clientType: "Multi-client Engagements",
    period: "Nov 2021 – Feb 2022",
    category: "foundation",
    tagline:
      "500GB+ analytical workloads on EMR + PySpark with optimized partitioning.",
    techStack: ["AWS EMR", "HDFS", "Hive", "PySpark", "Tableau"],
    problem:
      "Multiple client POCs needed proof-of-value for distributed analytical workloads at scale. Standard tools weren't keeping up with multi-hundred-GB datasets.",
    approach:
      "Designed distributed ETL pipelines on AWS EMR with optimized partitioning strategies, integrated with Hive for analytical workloads, and built real-time Tableau dashboards on top.",
    outcomes: [
      "500GB+ data volumes processed per pipeline",
      "65% reduction in report generation time",
      "Multiple client wins from POC successes",
    ],
    accentColor: "green",
  },
  {
    id: "iot-analytics",
    title: "Manufacturing IoT Analytics",
    client: "Bosch (Robert Bosch India)",
    clientType: "IoT · Manufacturing",
    period: "Sep 2019 – Dec 2020",
    category: "foundation",
    tagline:
      "Reduced MTBF 20% and MTTR 25%, saving $150K+ annually in maintenance costs.",
    techStack: ["Power BI", "IoT Sensors", "Root Cause Analysis", "Automation"],
    problem:
      "Plant leadership needed visibility into manufacturing equipment health. Reactive maintenance was expensive, and existing reports lagged real events by days.",
    approach:
      "Digitized executive KPI reporting via Power BI with automated data pipelines. Conducted root cause analysis on IoT sensor data to identify recurring failure patterns and inform predictive maintenance schedules.",
    outcomes: [
      "70% reduction in reporting cycle time",
      "20% MTBF improvement",
      "25% MTTR reduction",
      "$150K+ saved annually in maintenance costs",
    ],
    accentColor: "cyan",
  },
];

export const projectsByCategory = (category: ProjectCategory) =>
  projects.filter((p) => p.category === category);
