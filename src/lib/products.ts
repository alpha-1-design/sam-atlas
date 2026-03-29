export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: {
    africa: number;
    global: number;
  };
  features: string[];
  includes: string[];
  category: "prompts" | "templates" | "courses" | "ebooks";
  popular?: boolean;
  preview: string;
  downloadFile: string;
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
      africa: 75,
      global: 19,
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
      africa: 135,
      global: 29,
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
      africa: 225,
      global: 49,
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
      africa: 285,
      global: 97,
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
    africa: 1185,
    global: 79,
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
