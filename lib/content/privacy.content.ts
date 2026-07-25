import { APP_CONTACT } from "@/constants/Contact";

/**
 * Privacy Policy copy (English — Play Console / legal).
 * Keep in sync with backend GET /privacy HTML.
 */

export interface IPrivacySection {
  heading: string;
  body: string;
}

export const PRIVACY_TITLE = "Privacy Policy";

export const PRIVACY_LAST_UPDATED = "July 20, 2026";

export const PRIVACY_INTRO =
  "Jevan Hana (“we”, “us”) is a community app for residents of Jevan Hana, Garden Town, Lahore. This policy explains what information we collect, how we use it, and your choices.";

export const PRIVACY_SECTIONS: IPrivacySection[] = [
  {
    heading: "Information we collect",
    body: "Account details you provide when signing up (such as name, email, and profile photo), content you create (business listings, community posts, events, and reviews), and basic technical data needed to run the app (device and app version information related to crashes and reliability).",
  },
  {
    heading: "How we use information",
    body: "We use your information to operate the app, show community content, enable search and favorites, notify you about relevant activity, improve reliability, and keep the community safe (for example, moderating abuse).",
  },
  {
    heading: "Authentication and third parties",
    body: "Sign-in is powered by Clerk. Uploaded images may be stored with our cloud storage provider. Hosting and delivery may use our API host (currently Vercel) and related infrastructure. Those providers process data only as needed to provide their services.",
  },
  {
    heading: "Sharing",
    body: "We do not sell your personal information. Content you post in public areas of the app (such as listings, posts, or events) is visible to other users. We may share information if required by law or to protect the safety of the community.",
  },
  {
    heading: "Data retention and deletion",
    body: `We keep account and content data while your account is active and as needed to operate the service. You can edit or remove much of your content in the app. To request account deletion or help with data removal, email ${APP_CONTACT.email} or WhatsApp ${APP_CONTACT.whatsappDisplay}.`,
  },
  {
    heading: "Children",
    body: `Jevan Hana is intended for general community use. If you believe a child has provided personal information inappropriately, contact us at ${APP_CONTACT.email} or WhatsApp ${APP_CONTACT.whatsappDisplay} and we will take reasonable steps to address it.`,
  },
  {
    heading: "Changes",
    body: "We may update this policy from time to time. The “Last updated” date at the top will change when we do. Continued use of the app after updates means you accept the revised policy.",
  },
  {
    heading: "Contact",
    body: `Questions about privacy: email ${APP_CONTACT.email} or WhatsApp ${APP_CONTACT.whatsappDisplay}. You can also use the contact options on the About screen inside the Jevan Hana app.`,
  },
];
