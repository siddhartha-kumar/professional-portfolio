export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year?: string;
  featured?: boolean;
  description?: string;
};

export const certifications: Certification[] = [
  {
    id: "astronomer-champions",
    name: "Astronomer Champions Program",
    issuer: "Astronomer",
    year: "2024",
    featured: true,
    description:
      "Recognized by Astronomer for expertise and contributions to the Apache Airflow community. One of a select group invited annually.",
  },
  {
    id: "aws-ccp",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
  },
  {
    id: "az-900",
    name: "Microsoft Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
  },
  {
    id: "dp-900",
    name: "Microsoft Azure Data Fundamentals (DP-900)",
    issuer: "Microsoft",
  },
  {
    id: "ai-900",
    name: "Microsoft Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft",
  },
  {
    id: "airflow-3",
    name: "Astronomer Airflow 3 Fundamentals & DAG Authoring",
    issuer: "Astronomer",
  },
  {
    id: "databricks-genai",
    name: "Databricks Generative AI Fundamentals",
    issuer: "Databricks",
  },
  {
    id: "google-genai",
    name: "Google Generative AI Fundamentals",
    issuer: "Google",
  },
];
