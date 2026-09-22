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
export type Stat = { label: string; value: string }
export type Testimonial = {
  tag: string
  title: string
  quote: string
  name: string
  date: string
  avatar: ImageSlot
}
export type FooterColumn = { heading: string; links: Link[] }

const slot = (alt: string, aspectRatio: string): ImageSlot => ({ src: '', alt, aspectRatio })

// Hero photos: 4:5 crops at 400×500 (1x) and 800×1000 (2x).
const heroPhoto = (file: string, alt: string): ImageSlot => ({
  src: `/images/${file}-400.webp`,
  srcSet: `/images/${file}-400.webp 1x, /images/${file}-800.webp 2x`,
  alt,
  aspectRatio: '4 / 5',
  width: 400,
  height: 500,
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
      { name: 'Juhu Beachfront Villa', detail: '5 BHK Villa | Beachfront', price: '₹85,00,00,000', image: slot('Juhu Beachfront Villa', '1 / 1') },
      { name: 'Worli Sea Face Penthouse', detail: '4 BHK Penthouse | Sea View', price: '₹59,50,00,000', image: slot('Worli Sea Face Penthouse', '1 / 1') },
      { name: 'Malabar Hill Residence', detail: '4 BHK Residence | Bay View', price: '₹42,00,00,000', image: slot('Malabar Hill Residence', '1 / 1') },
    ],
  },

  services: {
    eyebrow: 'Professional Services',
    heading: 'Our Services & Expertise',
    intro: 'Comprehensive real estate solutions tailored to meet your unique needs and aspirations.',
    items: [
      { title: 'Property Selection', description: 'Exclusive access to off-market and hand-selected luxury properties.', image: slot('Property Selection', '6 / 7') },
      { title: 'Investment Advisory', description: 'Expert insights into market trends and investment opportunities.', image: slot('Investment Advisory', '6 / 7') },
      { title: 'Negotiation & Closing', description: 'Strategic negotiation and seamless transaction management.', image: slot('Negotiation & Closing', '6 / 7') },
      { title: 'Legal Compliance', description: 'Full support with documentation, permits, and regulatory compliance.', image: slot('Legal Compliance', '6 / 7') },
    ],
  },

  team: {
    eyebrow: 'Our Leadership',
    heading: 'Executive Team',
    intro: 'Meet the visionary leaders guiding Varenya Estates with expertise and dedication.',
    members: [
      { name: 'Siddharth Kulkarni', role: 'CEO', image: slot('Siddharth Kulkarni', '4 / 5') },
      { name: 'Meera Raghunathan', role: 'COO', image: slot('Meera Raghunathan', '4 / 5') },
      { name: 'Kabir Malhotra', role: 'CIO', image: slot('Kabir Malhotra', '4 / 5') },
    ],
  },

  numbers: {
    eyebrow: 'Track Record',
    heading: 'By The Numbers',
    intro: "Our proven track record speaks to our commitment and success in Mumbai's luxury real estate market.",
    stats: [
      { label: 'Properties Sold', value: '450+' },
      { label: 'Satisfied Clients', value: '650+' },
      { label: 'Total Value (₹ Cr)', value: '4,500' },
      { label: 'Countries', value: '45' },
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
        avatar: slot('Arvind Venkatesh', '1 / 1'),
      },
      {
        tag: 'Penthouse Collection',
        title: 'A Smooth & Sophisticated Experience',
        quote:
          'Finding a penthouse that matched my exacting standards seemed impossible, yet within weeks, the team presented three exceptional options. Their professionalism and attention to detail were impeccable throughout.',
        name: 'Priya Sharma',
        date: 'August 2024',
        avatar: slot('Priya Sharma', '1 / 1'),
      },
      {
        tag: 'Investment Advisory',
        title: 'Trusted Partner for International Clients',
        quote:
          'As a foreign investor, I appreciated the comprehensive legal and financial guidance. The team navigated complex regulations effortlessly, allowing me to invest with complete confidence.',
        name: 'Rohan Mehta',
        date: 'July 2024',
        avatar: slot('Rohan Mehta', '1 / 1'),
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
  team: SectionCopy & { members: TeamMember[] }
  numbers: SectionCopy & { stats: Stat[] }
  testimonials: SectionCopy & { items: Testimonial[] }
  cta: SectionCopy
  [key: string]: unknown
}
