export type Metric = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  color: "cyan" | "violet" | "green";
};

export const metrics: Metric[] = [
  {
    id: "concurrent-executions",
    value: 8000,
    suffix: "+",
    label: "Concurrent Executions",
    description: "Step Functions orchestrating real-time POS data",
    color: "cyan",
  },
  {
    id: "reliability",
    value: 99.9,
    suffix: "%",
    label: "Message Reliability",
    description: "Across 15+ international markets, sub-3-min SLA",
    color: "green",
  },
  {
    id: "deployment-speed",
    value: 85,
    suffix: "%",
    label: "Faster Deployments",
    description: "ML model rollout: 14 days → 2 days",
    color: "violet",
  },
  {
    id: "savings",
    value: 150,
    prefix: "$",
    suffix: "K+",
    label: "Annual Savings",
    description: "Reduced MTBF by 20%, MTTR by 25% at Bosch",
    color: "cyan",
  },
];
