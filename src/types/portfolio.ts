export interface ExperienceItem {
  id: string;
  num: string;
  company: string;
  context: string;
  focusAreas: string[];
  summary: string;
}

export interface AiProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  liveUrl?: string;
  videoUrl?: string;
  githubUrl?: string;
  cliPreview?: {
    command: string;
    outputLines: { text: string; color?: string }[];
  };
  metrics: { label: string; value: string }[];
  architecture?: { title: string; desc: string }[];
}

export interface PosterItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  offsetStyle?: string;
  mediaType?: "image" | "video";
}

export interface ResultsData {
  topStats: {
    experienceYears: string;
    adSets: string;
    medianRoas: string;
  };
  instagram: {
    title: string;
    subtitle: string;
    viewsValue: number;
    viewsSuffix: string;
    viewsLabel: string;
    viewsSublabel: string;
    proofType?: "image" | "link";
    url?: string;
    proofImage?: string;
    proofTitle?: string;
  };
  metaAds: {
    budget: string;
    impressionsValue: number;
    impressionsSuffix: string;
    cplvValue: number;
    cplvPrefix: string;
    cplvLabel: string;
    cplvSublabel: string;
    proofType?: "image" | "link";
    url?: string;
    proofImage?: string;
    proofTitle?: string;
  };
  googleAds: {
    impressionsValue: number;
    impressionsSuffix: string;
    impressionsDesc: string;
    clicksValue: number;
    clicksSuffix: string;
    localActionsValue: number;
    callsValue: number;
    spendValue: number;
    spendPrefix: string;
    proofType?: "image" | "link";
    url?: string;
    proofImage?: string;
    proofTitle?: string;
  };
  youtube: {
    title: string;
    subtitle: string;
    viewsValue: number;
    viewsSuffix: string;
    proofType?: "image" | "link";
    url?: string;
    proofImage?: string;
    proofTitle?: string;
  };
}

export interface PortfolioData {
  personal: {
    name: string;
    heroHeading: string;
    heroSubtitle: string;
    badgeText: string;
    resumeUrl: string;
    resumeFileName: string;
    location: string;
    availability: string;
  };
  socials: {
    email: string;
    phone: string;
    linkedin: string;
    instagram: string;
    github: string;
    twitter?: string;
    youtube?: string;
    calendly?: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    responseTime: string;
    statusText: string;
  };
  experiences: ExperienceItem[];
  aiProjects: AiProjectItem[];
  posters: PosterItem[];
  results: ResultsData;
  lastUpdated?: number;
}
