// Single source for all site copy and image references.

export type Link = { label: string; target: string }

export type SectionCopy = {
  eyebrow: string
  heading: string
  intro?: string
  ctas?: Link[]
}

/** Image slot. `src` stays empty until real photography is supplied; a grey placeholder renders meanwhile. */
export type ImageSlot = {
  src: string
  alt: string
  aspectRatio: string
  srcSet?: string
  sizes?: string
  width?: number
  height?: number
  /** Art-directed <picture> sources, first matching media wins; the img fields above are the fallback. */
  sources?: { media: string; srcSet: string; sizes: string; width: number; height: number }[]
}

export type Property = { name: string; detail: string; price: string; image: ImageSlot }
export type Service = { title: string; description: string; image: ImageSlot }
export type TeamMember = { name: string; role: string; image: ImageSlot }
export type Stat = { label: string; value: string; icon: 'house' | 'users' | 'dollar-sign' | 'trending-up' }
export type Testimonial = {
  tag: string
  title: string
  quote: string
  name: string
  date: string
  avatar: ImageSlot
  image: ImageSlot
}
export type FooterColumn = { heading: string; links: Link[] }

// Hero photos: 4:5 crops at 400×500 (1x) and 800×1000 (2x).
const heroPhoto = (file: string, alt: string): ImageSlot => ({
  src: `/images/${file}-400.webp`,
  srcSet: `/images/${file}-400.webp 1x, /images/${file}-800.webp 2x`,
  alt,
  aspectRatio: '4 / 5',
  width: 400,
  height: 500,
})

// 6:7 photos at 620×723 (1x) and 1240×1447 (2x). As in the reference, each photo is reused across
// slots (property cards are square crops of the same file via object-cover).
const tallPhoto = (file: string, alt: string, sizes: string): ImageSlot => ({
  src: `/images/${file}-620.webp`,
  srcSet: `/images/${file}-620.webp 620w, /images/${file}-1240.webp 1240w`,
  sizes,
  alt,
  aspectRatio: '6 / 7',
  width: 620,
  height: 723,
})
const propertySizes = '(width < 768px) 77vw, (width < 1536px) 27vw, 22vw'
const serviceSizes = '(width <= 768px) 80vw, (width < 1536px) 28.2vw, 21vw'
const photos = {
  juhu: ['property-juhu-villa', 'Aerial view of tropical villas on a rocky seafront'],
  worli: ['property-worli-sea-view', 'Sea view towards the Mumbai skyline from a terrace lined with bougainvillea'],
  malabar: ['property-malabar-hill-bay', 'Terrace garden overlooking the bay and the Mumbai skyline'],
  livingRoom: ['service-living-room', 'Bright living room with a leather sofa and city-view windows'],
} as const

// Team portraits: 4:5 crops at 450×563 and 900×1125. As in the reference, each portrait is reused
// as the matching testimonial avatar (circle crop at 48 and 96 px). Avatars sit beside the client name,
// so they are decorative (empty alt).
const teamSizes = '(width <= 768px) 80vw, (width <= 1440px) 29vw, 24vw'
const teamPhoto = (file: string, alt: string): ImageSlot => ({
  src: `/images/${file}-450.webp`,
  srcSet: `/images/${file}-450.webp 450w, /images/${file}-900.webp 900w`,
  sizes: teamSizes,
  alt,
  aspectRatio: '4 / 5',
  width: 450,
  height: 563,
})
const avatar = (file: string, alt: string): ImageSlot => ({
  src: `/images/${file}-avatar-48.webp`,
  srcSet: `/images/${file}-avatar-48.webp 1x, /images/${file}-avatar-96.webp 2x`,
  alt,
  aspectRatio: '1 / 1',
  width: 48,
  height: 48,
})
// Testimonial n reuses property photo n, as the reference does. On mobile the card height follows the
// photo's natural aspect, so these crops keep the reference files' ratios (3:2, then 1368:2000 twice).
const testimonialPhoto = (file: string, alt: string, w: number, h: number, sizes: string): ImageSlot => ({
  src: `/images/${file}-${w}.webp`,
  srcSet: `/images/${file}-${w}.webp ${w}w, /images/${file}-${w * 2}.webp ${w * 2}w`,
  sizes,
  alt,
  aspectRatio: `${w} / ${h}`,
  width: w,
  height: h,
})

const aboutTier = (media: string, tier: string, width: number, height: number, sizes: string) => ({
  media,
  srcSet: `/images/about-sea-view-lounge-${tier}-${width}.webp ${width}w, /images/about-sea-view-lounge-${tier}-${width * 2}.webp ${width * 2}w`,
  sizes,
  width,
  height,
})

export const content = {
  site: {
    name: 'Varenya Estates',
    city: 'Mumbai',
    country: 'India',
    copyrightYear: '2025',
    reraRegistrationNumber: '', // must stay empty until issued; nothing renders while empty
    reraLabel: 'MahaRERA Agent Registration No.',
  },

  nav: {
    logoText: 'Varenya Estates',
    logoTarget: '#hero',
    menuLabel: 'Menu',
    menu: [
      { label: 'Properties', target: '#properties' },
      { label: 'About', target: '#about' },
      { label: 'Services', target: '#services' },
      { label: 'Team', target: '#team' },
      { label: 'Testimonials', target: '#testimonials' },
      { label: 'Contact', target: '#contact' },
    ] satisfies Link[],
    cta: { label: 'Schedule Viewing', target: '#contact' } satisfies Link,
  },

  hero: {
    eyebrow: 'Premium Collections',
    heading: 'Discover Luxury Living in Mumbai',
    intro:
      'Exclusive properties curated for discerning buyers. Experience the pinnacle of sophistication with our award-winning real estate portfolio.',
    ctas: [
      { label: 'Explore Properties', target: '#properties' },
      { label: 'Contact Agent', target: '#contact' },
    ],
    // Order follows the reference, which repeats its first photo in slot 5.
    images: [
      heroPhoto('hero-living-room', 'Living room with floor-to-ceiling windows overlooking city towers'),
      heroPhoto('hero-skyline-night', 'Mumbai skyline at night reflected in still water'),
      heroPhoto('hero-sea-view-lounge', 'Open-plan lounge opening onto a sea-view terrace'),
      heroPhoto('hero-pool-lounge', 'Double-height lounge with glass walls overlooking an infinity pool and the sea'),
      heroPhoto('hero-living-room', 'Living room with floor-to-ceiling windows overlooking city towers'),
    ],
  },

  about: {
    eyebrow: 'About Us',
    heading: 'Your Trusted Mumbai Real Estate Partner',
    intro:
      "With over 15 years of excellence in Mumbai's luxury real estate market, we have established ourselves as the premier boutique agency for discerning international clientele. Our expert team specializes in sourcing and curating the finest properties across Mumbai's most exclusive communities.",
    ctas: [
      { label: 'Learn Our Story', target: '#services' },
      { label: 'Contact Us', target: '#contact' },
    ],
    // Covers the whole about block (object-fit: cover), so the box ratio varies by viewport.
    // Desktop tiers are centred landscape crops of the same columns as the portrait crop, each no wider
    // in ratio than the narrowest box in its range, so object-cover keeps scaling to width (same framing).
    image: {
      sources: [
        aboutTier('(width >= 1536px)', 'd', 1400, 640, 'min(72.5vw, 100rem)'),
        aboutTier('(width >= 1176px)', 'c', 1260, 705, '(width <= 1440px) 87.5vw, 72.5vw'),
        aboutTier('(width >= 1024px)', 'b', 1050, 675, '87.5vw'),
        aboutTier('(width >= 769px)', 'a', 900, 771, '87.5vw'),
      ],
      src: '/images/about-sea-view-lounge-684.webp',
      srcSet: '/images/about-sea-view-lounge-684.webp 684w, /images/about-sea-view-lounge-1368.webp 1368w',
      sizes: '80vw',
      alt: 'Sea-view lounge with an open terrace',
      aspectRatio: 'auto',
      width: 684,
      height: 1000,
    },
  },

  properties: {
    eyebrow: 'Exclusive Listings',
    heading: 'Featured Properties',
    intro:
      "Handpicked luxury properties showcasing the finest real estate opportunities in Mumbai's most prestigious locations.",
    ctas: [{ label: 'See all properties', target: '#properties' }],
    // Prices are ILLUSTRATIVE PROTOTYPE values only, not real listings or offers.
    items: [
      { name: 'Juhu Beachfront Villa', detail: '5 BHK Villa | Beachfront', price: '₹85,00,00,000', image: tallPhoto(...photos.juhu, propertySizes) },
      { name: 'Worli Sea Face Penthouse', detail: '4 BHK Penthouse | Sea View', price: '₹59,50,00,000', image: tallPhoto(...photos.worli, propertySizes) },
      { name: 'Malabar Hill Residence', detail: '4 BHK Residence | Bay View', price: '₹42,00,00,000', image: tallPhoto(...photos.malabar, propertySizes) },
    ],
  },

  services: {
    eyebrow: 'Professional Services',
    heading: 'Our Services & Expertise',
    intro: 'Comprehensive real estate solutions tailored to meet your unique needs and aspirations.',
    items: [
      { title: 'Property Selection', description: 'Exclusive access to off-market and hand-selected luxury properties.', image: tallPhoto(...photos.livingRoom, serviceSizes) },
      { title: 'Investment Advisory', description: 'Expert insights into market trends and investment opportunities.', image: tallPhoto(...photos.juhu, serviceSizes) },
      { title: 'Negotiation & Closing', description: 'Strategic negotiation and seamless transaction management.', image: tallPhoto(...photos.worli, serviceSizes) },
      { title: 'Legal Compliance', description: 'Full support with documentation, permits, and regulatory compliance.', image: tallPhoto(...photos.malabar, serviceSizes) },
    ],
  },

  // Carousel control labels shared by every carousel (reference wording; slide dots are numbered).
  carousel: { previous: 'Previous', next: 'Next', goToSlide: 'Go to slide' },

  team: {
    eyebrow: 'Our Leadership',
    heading: 'Executive Team',
    intro: 'Meet the visionary leaders guiding Varenya Estates with expertise and dedication.',
    members: [
      { name: 'Siddharth Kulkarni', role: 'CEO', image: teamPhoto('team-siddharth-kulkarni', 'Siddharth Kulkarni, CEO, in a navy suit in a bright office') },
      { name: 'Meera Raghunathan', role: 'COO', image: teamPhoto('team-meera-raghunathan', 'Meera Raghunathan, COO, in a navy blazer with arms crossed') },
      { name: 'Kabir Malhotra', role: 'CIO', image: teamPhoto('team-kabir-malhotra', 'Kabir Malhotra, CIO, in a navy blazer with arms crossed') },
    ],
  },

  numbers: {
    eyebrow: 'Track Record',
    heading: 'By The Numbers',
    intro: "Our proven track record speaks to our commitment and success in Mumbai's luxury real estate market.",
    stats: [
      { label: 'Properties Sold', value: '450+', icon: 'house' },
      { label: 'Satisfied Clients', value: '650+', icon: 'users' },
      { label: 'Total Value (₹ Cr)', value: '4,500', icon: 'dollar-sign' },
      { label: 'Countries', value: '45', icon: 'trending-up' },
    ],
  },

  testimonials: {
    eyebrow: 'Client Testimonials',
    heading: 'What Our Clients Say',
    intro: 'Experience through the words of satisfied buyers and investors who found their dream properties with us.',
    items: [
      {
        tag: 'Premium Portfolio',
        title: 'Exceptional Service & Market Expertise',
        quote:
          'The team at Varenya Estates demonstrated outstanding knowledge of the Mumbai market. Their negotiation skills saved me significant time and money. I would not hesitate to recommend them for any luxury property transaction.',
        name: 'Arvind Venkatesh',
        date: 'September 2024',
        avatar: avatar('team-siddharth-kulkarni', ''),
        image: testimonialPhoto('testimonial-juhu-villa', photos.juhu[1], 900, 600, '(width <= 768px) 160vw, 53vw'),
      },
      {
        tag: 'Penthouse Collection',
        title: 'A Smooth & Sophisticated Experience',
        quote:
          'Finding a penthouse that matched my exacting standards seemed impossible, yet within weeks, the team presented three exceptional options. Their professionalism and attention to detail were impeccable throughout.',
        name: 'Priya Sharma',
        date: 'August 2024',
        avatar: avatar('team-meera-raghunathan', ''),
        image: testimonialPhoto('testimonial-worli-sea-view', photos.worli[1], 560, 819, '(width <= 768px) 68vw, 35vw'),
      },
      {
        tag: 'Investment Advisory',
        title: 'Trusted Partner for International Clients',
        quote:
          'As a foreign investor, I appreciated the comprehensive legal and financial guidance. The team navigated complex regulations effortlessly, allowing me to invest with complete confidence.',
        name: 'Rohan Mehta',
        date: 'July 2024',
        avatar: avatar('team-kabir-malhotra', ''),
        image: testimonialPhoto('testimonial-malabar-hill-bay', photos.malabar[1], 560, 819, '(width <= 768px) 68vw, 35vw'),
      },
    ],
  },

  cta: {
    eyebrow: 'Get In Touch',
    heading: 'Ready to Find Your Dream Property?',
    ctas: [
      { label: 'Schedule Consultation', target: '#contact' },
      { label: 'Browse Listings', target: '#properties' },
    ],
  },

  footer: {
    columns: [
      {
        heading: 'Company',
        links: [
          { label: 'About Us', target: '#about' },
          { label: 'Our Services', target: '#services' },
          { label: 'Executive Team', target: '#team' },
          { label: 'Properties', target: '#properties' },
          { label: 'Contact', target: '#contact' },
        ],
      },
      {
        heading: 'Resources',
        links: ['Investment Guide', 'Market Reports', 'FAQ', 'Blog'].map((label) => ({ label, target: '#' })),
      },
      {
        heading: 'Legal',
        links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => ({ label, target: '#' })),
      },
    ] satisfies FooterColumn[],
    copyright: '© 2025 Varenya Estates Mumbai. All rights reserved.',
    tagline: 'Luxury Real Estate Excellence',
  },

  // Placeholders. The reference displays no address, phone or email anywhere, so these are not rendered.
  contact: {
    address: 'Worli, Mumbai, Maharashtra 400018',
    phone: '+91 22 0000 0000',
    email: 'info@varenyaestates.example',
  },
} satisfies {
  hero: SectionCopy & { images: ImageSlot[] }
  about: SectionCopy & { image: ImageSlot }
  properties: SectionCopy & { items: Property[] }
  services: SectionCopy & { items: Service[] }
  carousel: { previous: string; next: string; goToSlide: string }
  team: SectionCopy & { members: TeamMember[] }
  numbers: SectionCopy & { stats: Stat[] }
  testimonials: SectionCopy & { items: Testimonial[] }
  cta: SectionCopy
  [key: string]: unknown
}
