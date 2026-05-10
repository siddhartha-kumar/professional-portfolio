export type Experience = {
  id: string;
  company: string;
  /** Domain used for logo lookup (Google favicons API) */
  domain?: string;
  role: string;
  period: string;
  startYear: number;
  endYear: number | "Present";
  location: string;
  highlights: string[];
  current?: boolean;
};

export const experiences: Experience[] = [
  {
    id: "tiger-analytics",
    company: "Tiger Analytics India Consulting Pvt. Ltd.",
    domain: "tigeranalytics.com",
    role: "Data Engineer",
    period: "March 2022 – Present",
    startYear: 2022,
    endYear: "Present",
    location: "Bengaluru, India",
    current: true,
    highlights: [
      "Architected and built POS pipeline at 8,000+ concurrent executions",
      "Led PostgreSQL → DynamoDB migration (95% latency cut)",
      "Built ML Model Repository for pharma client (85% faster deployments)",
      "Engineered multi-tenant portal for 10+ enterprise clients",
      "Designed fault-tolerant Lambda functions with 99.9% reliability",
      "Automated marketing-mix workflows (90% manual intervention reduced)",
    ],
  },
  {
    id: "futurense",
    company: "Futurense Technologies Pvt. Ltd.",
    domain: "futurense.com",
    role: "Trainee Data Engineer",
    period: "November 2021 – February 2022",
    startYear: 2021,
    endYear: 2022,
    location: "Bengaluru, India",
    highlights: [
      "Built distributed ETL POCs on AWS EMR + PySpark (500GB+ workloads)",
      "Created real-time Tableau dashboards (65% faster reporting)",
    ],
  },
  {
    id: "bosch",
    company: "Bosch Limited (Robert Bosch India)",
    domain: "bosch.com",
    role: "Graduate Apprentice — Data Analytics",
    period: "September 2019 – December 2020",
    startYear: 2019,
    endYear: 2020,
    location: "Jaipur, India",
    highlights: [
      "Digitized executive KPI reporting (70% cycle reduction)",
      "IoT root cause analysis: 20% MTBF reduction, $150K+ saved annually",
      "Reduced MTTR by 25% via predictive maintenance insights",
    ],
  },
];
