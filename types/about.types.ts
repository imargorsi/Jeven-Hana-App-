/** About Us page content — Urdu-first; shaped for a future GET /api/v1/about JSON. */

export interface IAboutContact {
  heading: string;
  body?: string;
  /** WhatsApp number with country code, e.g. 923001234567 */
  whatsapp: string;
  whatsappLabel?: string;
  /** Prefill message when opening WhatsApp */
  whatsappMessage?: string;
  phone?: string;
  email?: string;
}

export interface IAboutContent {
  /** Single main heading (Urdu). */
  title: string;
  /**
   * Remote cover URL when backend sends one.
   * Empty / null → app uses the town fallback image.
   */
  coverImageUrl?: string | null;
  /** Body paragraphs in reading order (Urdu). */
  paragraphs: string[];
  contact: IAboutContact;
}
