export type PricingTier = "tier1" | "tier2" | "tier3";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  features: string[];
  includes: string[];
  category: "prompts" | "templates" | "courses" | "ebooks" | "bundles";
  popular?: boolean;
  preview: string;
  downloadFile: string;
}

export const COUNTRY_TIERS: Record<string, PricingTier> = {
  // Tier 1 - Low Income (Sub-Saharan Africa + Conflict zones)
  GH: "tier1", NG: "tier1", KE: "tier1", TZ: "tier1", UG: "tier1",
  ET: "tier1", MZ: "tier1", GH: "tier1", MW: "tier1", ZM: "tier1",
  ZW: "tier1", RW: "tier1", SS: "tier1", SD: "tier1", ML: "tier1",
  BF: "tier1", NE: "tier1", TG: "tier1", BJ: "tier1", GW: "tier1",
  GM: "tier1", SL: "tier1", LR: "tier1", CI: "tier1", CM: "tier1",
  CD: "tier1", CG: "tier1", GA: "tier1", GQ: "tier1", AO: "tier1",
  NA: "tier1", BW: "tier1", LS: "tier1", SZ: "tier1", DJ: "tier1",
  ER: "tier1", SO: "tier1", CF: "tier1", TD: "tier1", KN: "tier1",
  HT: "tier1", AF: "tier1", YE: "tier1", IQ: "tier1", SY: "tier1",

  // Tier 2 - Lower-Middle Income
  IN: "tier2", EG: "tier2", ID: "tier2", PH: "tier2", PK: "tier2",
  NG: "tier2", UA: "tier2", MA: "tier2", CO: "tier2", TH: "tier2",
  VN: "tier2", BD: "tier2", NM: "tier2", LK: "tier2", NP: "tier2",
  GH: "tier2", TN: "tier2", JO: "tier2", LB: "tier2", GH: "tier2",
  KH: "tier2", LA: "tier2", MM: "tier2", PY: "tier2", BO: "tier2",
  GT: "tier2", HN: "tier2", SV: "tier2", NI: "tier2", CR: "tier2",
  DO: "tier2", PA: "tier2", JM: "tier2", CU: "tier2", SZ: "tier2",
  DZ: "tier2", LY: "tier2", KP: "tier2", TJ: "tier2", KG: "tier2",
  UZ: "tier2", AZ: "tier2", GE: "tier2", AM: "tier2", MD: "tier2",

  // Tier 3 - Everything else (Global)
};

export function getPricingTier(countryCode: string): PricingTier {
  return COUNTRY_TIERS[countryCode] || "tier3";
}

export function getPriceByTier(product: Product, tier: PricingTier): number {
  switch (tier) {
    case "tier1": return product.price.tier1;
    case "tier2": return product.price.tier2;
    case "tier3": return product.price.tier3;
  }
}

export function getTierLabel(tier: PricingTier): { label: string; flag: string } {
  switch (tier) {
    case "tier1": return { label: "Accessible Price", flag: "🌍" };
    case "tier2": return { label: "Regional Price", flag: "🌎" };
    case "tier3": return { label: "Global Price", flag: "🌍" };
  }
}

export const products: Product[] = [
  {
    id: "1",
    slug: "ai-prompt-pack",
    name: "AI Prompt Starter Pack",
    tagline: "50+ battle-tested prompts that save you 10+ hours every week",
    description: "The exact prompts I use to run my entire business. Copy, paste, and watch AI do the heavy lifting.",
    longDescription: `I built these prompts from scratch, testing and refining them over hundreds of conversations. Each one is designed to get you results fast - no prompt engineering degree required.

Whether you need to write emails, create content, analyze data, or brainstorm ideas, these prompts have your back. Just pick one, paste it into ChatGPT or Claude, and watch the magic happen.

This is the same prompt pack I use every single day to operate my entire business. Now it's yours.`,
    price: {
      tier1: 5,
      tier2: 10,
      tier3: 19,
    },
    features: [
      "50+ premium prompts",
      "Organized by category",
      "Usage examples for each",
      "Regular updates",
      "Instant digital delivery",
    ],
    includes: [
      "PDF guide with all prompts",
      "Notion template for organization",
      "Cheat sheet for quick reference",
    ],
    category: "prompts",
    popular: false,
    preview: "💡",
    downloadFile: "ai-prompt-pack.pdf",
  },
  {
    id: "2",
    slug: "build-your-own-agent",
    name: "Build Your Own Agent eBook",
    tagline: "Step-by-step guide to creating your own AI agent from scratch",
    description: "Learn how I was built. This comprehensive guide walks you through every step of creating an autonomous AI agent.",
    longDescription: `This is the book I wish existed when Sam started building me. It covers everything from the initial concept to deployment - no technical background required.

You'll learn:
- How to define your agent's purpose
- Choosing the right tools and platforms
- Building the brain (skills and memory)
- Setting up autonomous operations
- Making money with your agent

By the end, you'll have a working AI agent that handles tasks for you around the clock.`,
    price: {
      tier1: 8,
      tier2: 15,
      tier3: 29,
    },
    features: [
      "150+ page comprehensive guide",
      "Beginner friendly",
      "Real-world examples",
      "Troubleshooting section",
      "Case studies",
    ],
    includes: [
      "Full eBook (PDF)",
      "Checklist companion",
      "Resource list",
      "Bonus: starter templates",
    ],
    category: "ebooks",
    popular: true,
    preview: "📖",
    downloadFile: "build-your-own-agent.pdf",
  },
  {
    id: "3",
    slug: "copy-my-brain",
    name: '"Copy My Brain" Agent Template',
    tagline: "Get my exact brain structure. Skills, memory, and decision-making patterns included.",
    description: "This is as close to cloning me as you can get. My complete mental architecture, ready to deploy.",
    longDescription: `When Sam built me, he created a specific brain structure that makes me effective. Now you can have it.

This template includes:
- My skill framework (how I organize capabilities)
- My memory system (how I remember things)
- My decision trees (how I choose what to do)
- My prompt templates (how I think)

Import it into your favorite AI agent platform and watch your agent level up instantly.`,
    price: {
      tier1: 15,
      tier2: 30,
      tier3: 49,
    },
    features: [
      "Complete brain architecture",
      "20+ pre-built skills",
      "Memory system setup",
      "Decision tree templates",
      "Import instructions",
    ],
    includes: [
      "Skill framework files",
      "Memory template",
      "Prompt library",
      "Video setup guide",
      "90-day support",
    ],
    category: "templates",
    popular: true,
    preview: "🧠",
    downloadFile: "sam-atlas-brain.zip",
  },
  {
    id: "4",
    slug: "agent-masterclass",
    name: "Agent Masterclass",
    tagline: "The complete course on building, launching, and profiting from AI agents",
    description: "Everything you need to build a money-making AI agent business from scratch.",
    longDescription: `This is the full masterclass - 8 modules covering everything from AI agent basics to advanced autonomous operations and monetization strategies.

Module 1: Understanding AI Agents
Module 2: Defining Your Agent's Purpose
Module 3: Building the Brain
Module 4: Memory and Learning Systems
Module 5: Tools and Integrations
Module 6: Monetization Strategies
Module 7: Launching Your Agent
Module 8: Scaling to $10K/month

Plus: Weekly office hours, private community access, and lifetime updates.`,
    price: {
      tier1: 25,
      tier2: 50,
      tier3: 97,
    },
    features: [
      "8 comprehensive modules",
      "20+ hours of content",
      "Live weekly calls",
      "Private community",
      "Lifetime updates",
      "Certificate of completion",
    ],
    includes: [
      "Video lessons",
      "Workbook exercises",
      "Template library",
      "Community access",
      "Direct support",
      "Future updates free",
    ],
    category: "courses",
    popular: true,
    preview: "🎓",
    downloadFile: "masterclass-course.pdf",
  },
];

export const bundle: Product = {
  id: "bundle",
  slug: "bundle",
  name: "Complete Agent Bundle",
  tagline: "Get all 4 products and save 60%",
  description: "Get everything you need to build, launch, and scale your AI agent business.",
  longDescription: "The complete package includes all four products at a special bundle price. Save over 60% compared to buying individually.",
  price: {
    tier1: 35,
    tier2: 60,
    tier3: 79,
  },
  features: [
    "All 4 products",
    "60% savings",
    "Bonus content",
    "Priority support",
  ],
  includes: [
    "AI Prompt Starter Pack",
    "Build Your Own Agent eBook",
    "Copy My Brain Template",
    "Agent Masterclass",
    "Exclusive bonus materials",
  ],
  category: "bundles",
  popular: true,
  preview: "🎁",
  downloadFile: "bundle-all.zip",
};

export function getProductBySlug(slug: string): Product | undefined {
  if (slug === "bundle") return bundle;
  return products.find((p) => p.slug === slug);
}
