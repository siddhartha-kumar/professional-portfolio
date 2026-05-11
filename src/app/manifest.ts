import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Siddhartha Kumar — Professional Portfolio",
    short_name: "Siddhartha Kumar",
    description:
      "Data Engineer with around 6 years architecting fault-tolerant, event-driven systems on AWS, Snowflake & Databricks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0F",
    theme_color: "#0A0A0F",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["portfolio", "engineering", "technology"],
  };
}
