export type StackCategory = {
  id: string;
  title: string;
  description: string;
  items: { name: string; level?: "expert" | "advanced" | "proficient" }[];
};

export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    title: "Languages & Frameworks",
    description: "Daily-use, production-tested",
    items: [
      { name: "Python", level: "expert" },
      { name: "SQL", level: "expert" },
      { name: "PySpark", level: "expert" },
      { name: "Pandas", level: "expert" },
      { name: "NumPy", level: "advanced" },
      { name: "Boto3", level: "expert" },
      { name: "Flask", level: "advanced" },
      { name: "REST APIs", level: "expert" },
      { name: "Shell Scripting", level: "advanced" },
    ],
  },
  {
    id: "aws",
    title: "AWS Cloud",
    description: "Primary cloud — production architecture",
    items: [
      { name: "Lambda", level: "expert" },
      { name: "Step Functions", level: "expert" },
      { name: "DynamoDB", level: "expert" },
      { name: "S3", level: "expert" },
      { name: "Athena", level: "advanced" },
      { name: "Glue", level: "advanced" },
      { name: "EMR", level: "advanced" },
      { name: "EC2", level: "advanced" },
      { name: "API Gateway", level: "advanced" },
      { name: "CloudWatch", level: "expert" },
      { name: "EventBridge", level: "advanced" },
      { name: "SNS / SQS", level: "advanced" },
      { name: "IAM", level: "advanced" },
    ],
  },
  {
    id: "data-platforms",
    title: "Data Platforms",
    description: "Storage & query engines",
    items: [
      { name: "Snowflake", level: "expert" },
      { name: "PostgreSQL", level: "advanced" },
      { name: "DynamoDB", level: "expert" },
      { name: "Hive", level: "proficient" },
      { name: "Data Lakes", level: "advanced" },
      { name: "Data Warehouses", level: "advanced" },
    ],
  },
  {
    id: "distributed",
    title: "Distributed Systems",
    description: "Architecture patterns & frameworks",
    items: [
      { name: "Apache Spark", level: "expert" },
      { name: "Apache Airflow", level: "expert" },
      { name: "Event-Driven Architecture", level: "expert" },
      { name: "Microservices", level: "advanced" },
      { name: "Message Queues", level: "advanced" },
    ],
  },
  {
    id: "engineering",
    title: "Data Engineering",
    description: "Patterns & methodologies",
    items: [
      { name: "ETL / ELT Pipelines", level: "expert" },
      { name: "Dimensional Modeling", level: "advanced" },
      { name: "OLAP", level: "advanced" },
      { name: "SCD Type 2", level: "advanced" },
      { name: "Schema Design", level: "expert" },
      { name: "Partitioning", level: "expert" },
      { name: "Indexing", level: "advanced" },
      { name: "Data Quality", level: "advanced" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tooling",
    description: "Build, ship, observe",
    items: [
      { name: "Docker", level: "advanced" },
      { name: "Git", level: "expert" },
      { name: "Azure DevOps", level: "advanced" },
      { name: "CI/CD", level: "advanced" },
      { name: "Terraform", level: "proficient" },
      { name: "Grafana", level: "advanced" },
      { name: "JIRA", level: "expert" },
      { name: "Agile / Scrum", level: "expert" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & BI",
    description: "Visualization & analytical platforms",
    items: [
      { name: "Power BI", level: "advanced" },
      { name: "Tableau", level: "advanced" },
      { name: "Databricks", level: "expert" },
      { name: "Dataiku DSS", level: "advanced" },
    ],
  },
];
