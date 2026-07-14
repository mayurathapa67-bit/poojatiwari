export type WritingCategory =
  | "Blog Posts"
  | "SEO Content"
  | "Website Copy"
  | "Technical Writing"
  | "Creative Writing";

export interface NavLink {
  label: string;
  href: string;
}

export interface Nav {
  logo: string;
  links: NavLink[];
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface Hero {
  title: string;
  role: string;
  tagline: string;
  cta_primary: CtaLink;
  cta_secondary: CtaLink;
  image: string;
}

export interface ExpertiseArea {
  id: number;
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface About {
  headline: string;
  bio: string;
  philosophy: string;
  expertise: ExpertiseArea[];
  experience: ExperienceItem[];
  certifications: string[];
  image: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  price?: string;
  features: string[];
}

export interface WritingSample {
  id: number;
  title: string;
  category: WritingCategory;
  excerpt: string;
  content: string;
  client?: string;
  published_date: string;
  read_time: number;
  featured_image: string;
  featured?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  published_date: string;
  read_time: number;
  category: string;
  featured_image: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface Socials {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface PersonalInfo {
  name: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
}

export interface ContactInfo {
  heading: string;
  email: string;
  phone: string;
  location: string;
  socials: Socials;
}

export interface PortfolioData {
  personal: PersonalInfo;
  nav: Nav;
  hero: Hero;
  about: About;
  services: Service[];
  portfolio: WritingSample[];
  blog: BlogPost[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  contact: ContactInfo;
  socials: Socials;
}

export type SectionKey = keyof PortfolioData;
