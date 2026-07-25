import { APP_CONTACT } from "@/constants/Contact";

/**
 * Community Guidelines (English — Play Console / UGC policy).
 * Keep in sync with backend GET /guidelines HTML.
 */

export interface IGuidelinesSection {
  heading: string;
  body: string;
}

export const GUIDELINES_TITLE = "Community Guidelines";

export const GUIDELINES_LAST_UPDATED = "July 25, 2026";

export const GUIDELINES_INTRO =
  "Jevan Hana is a neighbourhood app for residents of Jevan Hana, Garden Town, Lahore. These guidelines help keep the community useful, respectful, and safe.";

export const GUIDELINES_SECTIONS: IGuidelinesSection[] = [
  {
    heading: "Be respectful",
    body: "Treat neighbours with respect. No hate speech, harassment, threats, bullying, or personal attacks.",
  },
  {
    heading: "Keep it local and useful",
    body: "Listings, posts, and events should relate to Jevan Hana / Garden Town life. Prefer clear, honest information that helps residents.",
  },
  {
    heading: "Be truthful",
    body: "Do not post fake businesses, misleading offers, or stolen content. Use your real contact details when listing a business.",
  },
  {
    heading: "No spam or scams",
    body: "No repeated promotional spam, phishing, fraud, or unrelated advertising floods.",
  },
  {
    heading: "Illegal or unsafe content",
    body: "Do not share illegal content, violence, exploitation, or anything that endangers others. We will remove it and may remove accounts.",
  },
  {
    heading: "Photos and privacy",
    body: "Only upload photos you have the right to use. Do not post private information about others without permission.",
  },
  {
    heading: "Reporting and moderation",
    body: "Use Report on posts, listings, and events if something breaks these rules. Admins may edit or remove content and take action on accounts. For urgent help, email or WhatsApp support.",
  },
  {
    heading: "Contact",
    body: `Questions or appeals: email ${APP_CONTACT.email} or WhatsApp ${APP_CONTACT.whatsappDisplay}.`,
  },
];
