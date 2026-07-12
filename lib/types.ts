export interface ImageSet {
  original: string;
  thumb?: string;
  medium?: string;
  large?: string;
}

export interface PersonalInfo {
  name: string;
  profession: string;
  phone: string;
  email: string;
  locationAU: string;
  locationNP: string;
  bio: string;
  avatar: ImageSet;
}

export interface Hero {
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface About {
  heading: string;
  description: string;
  skills: string[];
}

export interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: ImageSet;
}

export interface Contact {
  heading: string;
  email: string;
  phone: string;
  locationAU: string;
  locationNP: string;
}

export interface Socials {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  hero: Hero;
  about: About;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  contact: Contact;
  socials: Socials;
}

export type SectionKey = keyof PortfolioData;
