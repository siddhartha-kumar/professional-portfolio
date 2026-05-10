export const profile = {
  name: "Siddhartha Kumar",
  shortName: "Siddhartha",
  initials: "SK",
  role: "Data Engineer",
  currentCompany: "Tiger Analytics",
  location: "Bengaluru, India",
  yearsOfExperience: "6",
  email: "shivsiddhartha187@hotmail.com",
  phone: "+91 9116155496",
  social: {
    github: "https://github.com/siddhartha-kumar",
    githubUsername: "siddhartha-kumar",
    linkedin: "https://www.linkedin.com/in/siddhartha--kumar/",
  },
  /**
   * Primary avatar — your personal photo.
   * Place file at /public/sidd.jpg (or /public/sidd.png — change extension here).
   * If the file is missing, automatically falls back to `avatarFallbackUrl` (GitHub),
   * then to gradient initials.
   */
  avatarUrl: "/sidd.jpg",
  avatarFallbackUrl: "https://github.com/siddhartha-kumar.png",
  resumePath: "/resume/Siddhartha_Kumar_DataEngineer.pdf",
  tagline: {
    line1: "Engineering data systems",
    line2: "that scale beyond limits.",
  },
  subheadline:
    "Around six years of architecting and building fault-tolerant, event-driven systems that process millions of transactions across global markets. Currently at Tiger Analytics, developing production solutions for Fortune 500 clients.",
  liveTickerItems: [
    "8,000+ concurrent executions",
    "99.9% reliability",
    "15+ international markets",
    "$150K+ annual savings",
    "85% faster deployments",
    "10+ enterprise clients served",
  ],
  about: {
    title: "I build the systems that move data — reliably, at scale, under pressure.",
    paragraphs: [
      "My career started on a factory floor at Bosch, where I learned that data isn't abstract. It's a sensor on a manufacturing line, an alert at 3 AM, the difference between $150K saved or lost. That perspective never left.",
      "Six years later, I'm architecting serverless event-driven pipelines that handle 8,000 concurrent executions with sub-second latency. I've migrated databases from PostgreSQL to DynamoDB without losing a transaction, built ML registries that compress 14-day deployments into 2, and engineered platforms that 50+ data scientists rely on daily.",
      "The best infrastructure is the kind nobody notices — until it isn't there. I obsess over the boring, hard parts: idempotency, fault tolerance, auditability, the 99.9th percentile. That's where reliability lives. That's the work I love.",
    ],
    quickFacts: [
      { label: "Bengaluru, IN", icon: "MapPin" },
      { label: "6 Years Experience", icon: "Calendar" },
      { label: "15+ Markets", icon: "Globe" },
      { label: "7 Certifications", icon: "Award" },
    ],
  },
  contact: {
    title: "Let's build something that scales.",
    subtitle:
      "Working on infrastructure that needs to be fast, fault-tolerant, and audited? That's the kind of problem I solve. Reach out — I read everything.",
  },
} as const;

export type Profile = typeof profile;
