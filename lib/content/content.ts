import type { PressMention, ProcessStep } from '@/types'

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Register',
    description:
      'Submit your entry for the category that fits your enterprise. It only takes a few minutes.',
  },
  {
    index: '02',
    title: 'Go Live Instantly',
    description:
      'No waiting on a panel. Your profile publishes on the public voting page the moment you finish.',
  },
  {
    index: '03',
    title: 'Share & Gather Votes',
    description:
      'Share your personal voting link everywhere. Voting is open now, and every vote counts.',
  },
  {
    index: '04',
    title: 'The Top Four Win',
    description:
      'When voting closes, the four highest-voted in each category are honoured at the ceremony.',
  },
]

export const objectives = [
  {
    title: 'Inspire Excellence',
    body: 'Recognise, reward and celebrate outstanding young entrepreneurs driving innovation and growth in Lagos State.',
  },
  {
    title: 'Stimulate Growth',
    body: 'Create new business opportunities and generate sustainable employment for young people.',
  },
  {
    title: 'Position Lagos',
    body: 'Establish Lagos State as a hub for youth-driven innovation, investment and sustainable development.',
  },
  {
    title: 'Connect the Ecosystem',
    body: 'Build a platform that encourages collaboration, mentorship and collective development.',
  },
]

export const eligibilityCriteria = [
  'A resident of Lagos State for a minimum of five (5) consecutive years.',
  'Has actively operated a business within Lagos State for at least five (5) years.',
  'Duly nominated and successfully validated through the official voting process.',
  'Not above fifty (50) years of age at the time of nomination.',
  'The Founder, CEO or Managing Director of a duly registered and reputable business entity.',
]

export const experiences = [
  {
    title: 'Red Carpet Reception',
    description: 'A high-visibility arrival worthy of the guests it gathers.',
  },
  {
    title: 'Entrepreneurship Masterclass',
    description: 'A working session with operators who have built and scaled in Lagos.',
  },
  {
    title: 'Lifetime Achievement Investiture',
    description: "Five business icons invested with the evening's highest honour.",
  },
  {
    title: 'The Awards Ceremony',
    description: 'Forty-three competitive titles and three special honours, presented in full.',
  },
]

export const distinguishedGuests = [
  'The Executive Governor of Lagos State',
  'Senators & Members of the House of Representatives',
  'Members of the Lagos State House of Assembly',
  'Commissioners & the State Executive Council',
  'Local Government Chairmen & public-sector leaders',
  'Leading entrepreneurs & business owners',
  'Chief executives & corporate leaders',
  'High-net-worth individuals & prominent personalities',
  'Influential figures from the entertainment industry',
  'Former beauty queens & pageant title holders',
  'Emerging youth leaders & aspiring entrepreneurs',
]

export interface SponsorshipTier {
  name: string
  price: number
  priceLabel: string
  limited: string | null
  summary: string
  benefits: string[]
  featured?: boolean
}

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    name: 'Principal Sponsor',
    price: 50_000_000,
    priceLabel: '₦50,000,000',
    limited: 'One sponsor only',
    summary:
      'The headline partnership, maximum brand dominance across every touchpoint of the awards.',
    featured: true,
    benefits: [
      'Exclusive title recognition as Principal Sponsor across all platforms',
      "Name & logo on all winners' award plaques",
      'Featured across TV & radio jingles, website and print campaigns',
      'Branded VIP table for ten distinguished guests',
      '5-10 minute speaking slot for a company executive',
      'Three full-page adverts plus a CEO goodwill message in the brochure',
      'Logo with link on the LAYEAWARDS website for one full year',
    ],
  },
  {
    name: 'Platinum Sponsor',
    price: 30_000_000,
    priceLabel: '₦30,000,000',
    limited: 'Two sponsors only',
    summary: 'High-level visibility, strong media presence and strategic stakeholder engagement.',
    benefits: [
      'Official recognition as Platinum Sponsor across all communications',
      'Featured across TV & radio jingles, website and print media',
      'Branded VIP table for ten distinguished guests',
      '3-5 minute speaking slot for a company representative',
      'Two full-page adverts plus a full company profile in the brochure',
      'Logo with link on the website homepage for six months',
    ],
  },
  {
    name: 'Gold Sponsor',
    price: 10_000_000,
    priceLabel: '₦10,000,000',
    limited: 'Three sponsors only',
    summary: 'Strong visibility and credible association within a high-profile business audience.',
    benefits: [
      'Official recognition as Gold Sponsor across key communications',
      'Brand on radio jingles, website and print media',
      'VIP table for ten distinguished guests',
      '3-minute address by a company representative',
      'One full-page advert plus a company profile in the brochure',
      'Logo with link on the website for three months',
    ],
  },
  {
    name: 'Silver Sponsor',
    price: 5_000_000,
    priceLabel: '₦5,000,000',
    limited: null,
    summary: 'Consistent visibility and engagement throughout the campaign lifecycle.',
    benefits: [
      'Official recognition as Silver Sponsor across key platforms',
      'Integrated exposure pre-event, on-site and post-event',
      'Privilege of presenting an award to a winner on stage',
      'VIP table for ten guests',
      'Logo with link on the official website',
    ],
  },
  {
    name: 'Category Sponsor',
    price: 3_000_000,
    priceLabel: '₦3,000,000',
    limited: null,
    summary: 'Own an award category outright, with targeted brand alignment and recognition.',
    benefits: [
      'Exclusive sponsorship of a chosen award category',
      'Recognition as the Category Sponsor across event materials',
      'Logo with link on the official website',
      'Logo and credit in the official awards brochure',
      'VIP table for ten guests',
    ],
  },
  {
    name: 'Table Sponsor',
    price: 2_000_000,
    priceLabel: '₦2,000,000',
    limited: null,
    summary: 'Premium table branding and hospitality with direct access to high-profile guests.',
    benefits: [
      'Exclusive branding rights on table or place settings',
      'Recognition as the Table Setting Sponsor',
      'Logo with link on the official website',
      'Logo and credit in the official brochure',
      'VIP table for ten guests',
    ],
  },
]

export const advertisingRates = [
  {
    name: 'Centre Spread',
    priceLabel: '₦900,000',
    note: 'Double-page premium placement, maximum visibility in the event brochure.',
  },
  {
    name: 'Full Page',
    priceLabel: '₦750,000',
    note: 'Glossy, full-colour full-page placement with strong visual presence.',
  },
  {
    name: 'Venue Roll-Up Banner',
    priceLabel: '₦700,000',
    note: 'On-site brand visibility with a roll-up banner at the event venue.',
  },
  {
    name: 'Half Page',
    priceLabel: '₦400,000',
    note: 'Glossy, full-colour placement for concise, effective communication.',
  },
  {
    name: 'Quarter Page',
    priceLabel: '₦250,000',
    note: 'A cost-effective route to brand presence within the official brochure.',
  },
]

export interface Sponsor {
  name: string
  logoUrl?: string
  /** A prominent individual rather than a brand, featured with a portrait. */
  prominent?: boolean
  /** Subtitle/role shown under a prominent patron's name. */
  title?: string
  /** An additional crest/emblem shown beside a prominent patron. */
  crestUrl?: string
  /** Show the name under the logo (for image logos with no wordmark). */
  showName?: boolean
}

export interface Edition {
  number: number
  slug: string
  ordinal: string
  location: string
  theme: string
  imageUrl: string
  sponsors: Sponsor[]
  /** When true, the edition card is not clickable (no detail page link). */
  noDetail?: boolean
  /** CSS object-position for the cover image (default 'center top'). */
  coverPosition?: string
}

const watercressSponsors: Sponsor[] = [
  {
    name: 'Senator Mukhail Adetokunbo Abiru',
    title: 'Senator, Lagos East',
    prominent: true,
    logoUrl: '/senatorabiru.jpg',
  },
  { name: 'Complete Sports Newspaper', logoUrl: '/completesports.png' },
  { name: 'Set It Up Entertainment' },
  { name: 'PWAN Xtra', logoUrl: '/pwanxtra.jpg' },
  { name: 'Mountain Bridge', logoUrl: '/mountainbridge.jpg' },
  { name: 'Glemvnt', logoUrl: '/glemvnt.avif' },
  { name: 'Imran Roofing & Properties', logoUrl: '/Untitled-design.png' },
  { name: 'Pointrite Auto', logoUrl: '/pointriteauto.jpg' },
  { name: 'Ketsconnect' },
  { name: 'Lush Private Jet Services', logoUrl: '/lpjet.jpg', showName: true },
]

export const editions: Edition[] = [
  {
    number: 1,
    slug: 'first',
    ordinal: 'First Edition',
    location: 'Lagos Travel Inn Hotel & Suites',
    theme: 'The night a quiet idea became a Lagos institution.',
    imageUrl: '/editions/1/1.jpg',
    sponsors: [],
    coverPosition: '32% 18%',
  },
  {
    number: 2,
    slug: 'second',
    ordinal: 'Second Edition',
    location: 'Lagos Travel Inn Hotel & Suites',
    theme: 'A wider stage, and the first wave of returning honourees.',
    imageUrl: '/editions/2/1.jpg',
    sponsors: [],
    noDetail: true,
  },
  {
    number: 3,
    slug: 'third',
    ordinal: 'Third Edition',
    location: 'Lagos Travel Inn Hotel & Suites',
    theme: 'New categories opened the floor to a new generation.',
    imageUrl: '/editions/3/12.jpg',
    sponsors: [
      {
        name: 'Her Excellency, Senator Oluremi Tinubu',
        title: 'First Lady, Federal Republic of Nigeria',
        prominent: true,
        logoUrl: '/Oluremi-Tinubu.webp',
        crestUrl: '/federarepublicofnigeria.jpg',
      },
    ],
  },
  {
    number: 4,
    slug: 'fourth',
    ordinal: 'Fourth Edition',
    location: 'Eko Hotel & Suites',
    theme: 'The red carpet that turned recognition into a spectacle.',
    imageUrl: '/editions/4/1.jpg',
    sponsors: [],
  },
  {
    number: 5,
    slug: 'fifth',
    ordinal: 'Fifth Edition',
    location: 'Watercress Hotel & Suites, Ikeja',
    theme: 'Mentorship, masterclasses and the rise of the LAYE Awards Magazine.',
    imageUrl: '/editions/5/1.jpg',
    sponsors: watercressSponsors,
  },
  {
    number: 6,
    slug: 'sixth',
    ordinal: 'Sixth Edition',
    location: 'Watercress Hotel & Suites, Ikeja',
    theme: "Lagos' young enterprise, honoured on its biggest night yet.",
    imageUrl: '/editions/6/1.jpg',
    sponsors: [...watercressSponsors, { name: 'Guava Holdings', logoUrl: '/guavaholdings.jpg' }],
  },
]

export const getEditionBySlug = (slug: string) => editions.find(edition => edition.slug === slug)

export const press: PressMention[] = [
  {
    id: 'press-thisday',
    publication: 'ThisDay',
    headline: 'Sixth Edition of Lagos Young Entrepreneur Awards Set for September 2025',
    articleUrl:
      'https://www.thisdaylive.com/2025/06/03/sixth-edition-of-lagos-young-entrepreneur-awards-set-for-september-2025/',
    publishedDate: 'June 3, 2025',
    logoUrl: '/press/article1_image.jpg',
    excerpt:
      'ThisDay covers the sixth edition of the Lagos Young Entrepreneur Awards, scheduled for September 2025 in Lagos.',
  },
  {
    id: 'press-punch',
    publication: 'The Punch',
    headline: 'LAYEAWARDS to Honour Entrepreneurs Driving Lagos Economy',
    articleUrl: 'https://punchng.com/layeawards-to-honour-entrepreneurs-driving-lagos-economy/',
    publishedDate: 'June 2025',
    logoUrl: '/press/punch_logo.png',
    excerpt:
      'The Punch profiles LAYEAWARDS, the platform turning the spotlight on the founders driving the Lagos economy.',
  },
  {
    id: 'press-radarr',
    publication: 'Radarr Africa',
    headline: 'Lagos Young Entrepreneur Awards Set to Celebrate Rising Entrepreneurs',
    articleUrl:
      'https://radarr.africa/lagos-young-entrepreneur-awards-set-to-celebrate-rising-entrepreneurs/',
    publishedDate: 'June 2025',
    logoUrl: '/press/radarr_africa.png',
    excerpt:
      'Radarr Africa highlights LAYEAWARDS as the credible platform celebrating the next generation of Lagos enterprise.',
  },
]

export const founderWord = {
  quote:
    'LAYEAWARDS has grown over the years into a strong platform that highlights innovations by young people.',
  context:
    'Across six editions the awards have set out to inspire a new generation of business leaders, reward genuine excellence, and make the case, loudly, for the role young enterprise plays in the economic life of Lagos.',
  attribution: 'Oluwanisola Ashifat',
  role: 'Chief Executive Officer & Creative Director',
}

export interface GalleryImage {
  id: string
  imageUrl: string
  caption: string
  span: 'regular' | 'tall' | 'wide'
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'g-01',
    imageUrl: '/gallery/g-01.png',
    caption: 'Red-carpet arrivals',
    span: 'tall',
  },
  {
    id: 'g-02',
    imageUrl: '/gallery/g-02.png',
    caption: 'The main stage',
    span: 'wide',
  },
  {
    id: 'g-03',
    imageUrl: '/gallery/g-03.png',
    caption: "An honouree's moment",
    span: 'regular',
  },
  {
    id: 'g-04',
    imageUrl: '/gallery/g-04.png',
    caption: 'The room rises',
    span: 'regular',
  },
]
