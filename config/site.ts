export const siteConfig = {
  name: 'LAYEAWARDS',
  fullName: 'Lagos Young Entrepreneurs Awards',
  organiser: 'LAYEAWARDS Enterprise',
  tagline: 'Celebrating the young enterprise reshaping Lagos.',
  domain: 'layeaward.com',
  url: 'https://layeaward.com',

  edition: {
    number: 7,
    ordinal: 'Seventh',
    year: 2026,
    eyebrow: 'Seventh Edition',
    ceremonyDate: null as string | null,
    city: 'Lagos, Nigeria',
  },

  timeline: {
    nominationsOpen: 'June 1, 2026',
    nominationsClose: 'August 15, 2026',
    votingOpens: 'August 20, 2026',
    votingCloses: 'September 30, 2026',
    finalistsPerCategory: 4,
  },

  figures: [
    {
      value: 46,
      suffix: '',
      label: 'Award Categories',
      note: 'Forty-three decided by public vote, plus three special honours conferred by the organisers.',
    },
    {
      value: 6,
      suffix: '',
      label: 'Editions Staged',
      note: 'A platform six years in the making.',
    },
    {
      value: 5,
      suffix: '',
      label: 'Lifetime Icons',
      note: 'Business legends invested with the Lifetime Achievement Award.',
    },
  ],

  voting: {
    pricePerVoteKobo: 10000,
    currency: 'NGN',
    currencySymbol: '₦',
    isOpen: true,
  },

  contact: {
    email: 'enquiries@layeaward.com',
    sponsorships: 'sponsorships@layeaward.com',
    phones: ['0903 630 5825', '0909 564 1132', '0805 675 3668'],
    address: null as string | null,
    rcNumber: null as string | null,
  },

  payment: {
    accountName: 'LAYEAWARDS ENTERPRISE',
    accountNumber: '1313008097',
    bank: 'Zenith Bank',
  },

  socials: {
    instagram: 'https://www.instagram.com/laye_awards',
    facebook: 'https://www.facebook.com/lagosyoungentrepreneursawards',
    linkedin:
      'https://www.linkedin.com/in/laye-awards-a97715418?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    youtube: 'https://youtube.com/@layeaward?si=aOAmPZzqLV9guyfA',
    whatsapp: 'https://wa.me/2349036305825',
  },

  leadership: {
    name: 'Oluwanisola Ashifat',
    title: 'Chief Executive Officer & Creative Director',
  },
} as const

export type SiteConfig = typeof siteConfig

export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Categories', href: '/categories' },
  { label: 'Vote', href: '/nominees' },
  { label: 'Sponsorship', href: '/sponsorship' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const
