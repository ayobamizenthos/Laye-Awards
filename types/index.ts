export type ApplicationStatus = 'pending' | 'approved' | 'rejected'
export type UserRole = 'nominee' | 'staff' | 'super_admin'
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'category' | 'table'

export type CategoryGroup = 'A' | 'B'

export interface Category {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  group: CategoryGroup
}

export interface Nominee {
  id: string
  slug: string
  fullName: string
  businessName: string
  categorySlug: string
  industry: string
  headline: string
  bio: string
  headshotUrl: string
  voteCount: number
  status: ApplicationStatus
  yearsOperating: number
}

export interface Winner {
  id: string
  fullName: string
  businessName: string
  categoryName: string
  editionYear: number
  portraitUrl: string
}

export interface Sponsor {
  id: string
  name: string
  tier: SponsorTier
  logoUrl: string | null
}

export interface PressMention {
  id: string
  publication: string
  headline: string
  articleUrl: string
  publishedDate: string
  logoUrl: string
  excerpt?: string
}

export interface Testimonial {
  id: string
  quote: string
  personName: string
  personRole: string
  editionYear: number | null
}

export interface GalleryItem {
  id: string
  imageUrl: string
  caption: string
  editionYear: number
  span: 'regular' | 'tall' | 'wide'
}

export interface ProcessStep {
  index: string
  title: string
  description: string
}
