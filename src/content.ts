// Only the description below is verified from estusciagroup.com.
// Fill the rest with real, confirmed information. Anything left null/empty renders a visible placeholder.
export interface Area { name: string; description: string }
export const CONTENT = {
  description: 'Estuscia Group, also known as Estuscia, is a business and investment platform.',
  email: '',                                   // e.g. 'hello@estusciagroup.com'
  siteUrl: 'https://www.estusciagroup.com/',
  mission: null as string | null,              // About section
  visionText: null as string | null,           // Vision section
  growthText: null as string | null,           // Growth section
  layers: [null, null] as (string | null)[],   // Emblem layers II & III
  strengths: [null, null, null] as (string | null)[], // Why Estuscia
  businessAreas: [] as Area[],                 // Business cards
  legal: [] as { label: string; href: string }[],     // Privacy, Terms...
  social: [] as { label: string; href: string }[],
};
