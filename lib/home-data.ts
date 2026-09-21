export interface HeroStat {
  value: string;
  label: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutSpecialization {
  title: string;
  desc: string;
}

export interface HeroSectionData {
  backgroundImageUrl: string;
  name: string;
  tagline: string;
  location: string;
  categoryTag: string;
  specialtyTag: string;
  description: string;
  secondaryDescription: string;
  badgeText: string;
  button1Text: string;
  button2Text: string;
  stats: [HeroStat, HeroStat, HeroStat];
}

export interface AboutSectionData {
  profileImageUrl: string;
  quote: string;
  sectionSubtitle: string;
  sectionHeading: string;
  headline: string;
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
  specializationsHeading: string;
  specializations: AboutSpecialization[];
  stats: [AboutStat, AboutStat, AboutStat];
  signOffName: string;
}

export interface ContactSectionData {
  sectionSubtitle: string;
  sectionHeading: string;
  introText: string;
  whatsappNumber: string;
  whatsappLink: string;
  emailAddress: string;
  instagramUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
  soundcloudUrl: string;
  availabilityNote: string;
  formHeading: string;
  formDescription: string;
}

export interface HomePageData {
  hero: HeroSectionData;
  about: AboutSectionData;
  contact: ContactSectionData;
}

export const INITIAL_HOME_PAGE_DATA: HomePageData = {
  hero: {
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85',
    name: 'Shazzad Hossain',
    tagline: 'Music Producer & Composer',
    location: 'Dhaka, Bangladesh',
    categoryTag: 'Official Artist Profile',
    specialtyTag: 'Film & BGM Composer',
    description:
      'Crafting emotive soundscapes, cinematic original scores, and genre-defying musical collaborations from the studio to the screen.',
    secondaryDescription:
      'Specializing in background score (BGM) for indie films & series, acoustic instrumentation, and modern electronic sound design with analog warmth.',
    badgeText: 'Studio & Scoring Suite',
    button1Text: 'Explore Portfolio',
    button2Text: 'Get in Touch',
    stats: [
      { value: '08+', label: 'Years Scoring' },
      { value: '45+', label: 'Releases' },
      { value: '30+', label: 'Collabs' },
    ],
  },
  about: {
    profileImageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85',
    quote: '“Every scene and story has an inherent rhythm waiting to be heard.”',
    sectionSubtitle: 'Biography & Philosophy',
    sectionHeading: 'About Shazzad Hossain',
    headline:
      'A commitment to narrative depth, organic acoustics, and sonic restraint.',
    bioParagraph1:
      'Hello, I am Shazzad Hossain — a music producer and composer based in the studio, collaborating with filmmakers, recording artists, and creative agencies globally. My musical journey began with classical piano and string harmony, gradually evolving through analog tape synthesizers, acoustic session recording, and contemporary production aesthetics.',
    bioParagraph2:
      'I specialize in creating bespoke background scores (BGM) for independent films and series, crafting original melodies that honor silence as much as sound. When collaborating with artists, I work closely from the initial songwriting draft through arrangement, vocal production, and the final master to realize the track\'s most authentic emotional core.',
    bioParagraph3:
      'Rather than chasing fleeting digital production fads, my studio practice is anchored in timeless musicality: real wooden instruments, expressive human dynamics, warm vintage preamplification, and deliberate arrangement spaces.',
    specializationsHeading: 'Specialized Disciplines',
    specializations: [
      {
        title: 'Film & Media Scoring (BGM)',
        desc: 'Cinematic compositions tailored to narrative pacing, character motifs, emotional swells, and subtle atmospheric beds for feature films, series, and documentaries.',
      },
      {
        title: 'Original Music & Production',
        desc: 'Arranging and producing full tracks from chordal sketches to final mixdown, marrying acoustic string instruments and felt piano with analog synthesizers.',
      },
      {
        title: 'Artist Collaborations',
        desc: 'Co-writing and producing alongside singer-songwriters, instrumentalists, and international vocalists across contemporary pop, neoclassical, ambient, and world fusion.',
      },
      {
        title: 'Mixdown & Analog Warmth',
        desc: 'Precision audio engineering with vintage tape emulation, ribbon mic recordings, and harmonic saturation to ensure depth and clarity across all playback systems.',
      },
    ],
    stats: [
      { value: '8+ Years', label: 'Experience in Industry' },
      { value: '45+ Works', label: 'Released Projects & Scores' },
      { value: '30+ Artists', label: 'Artist & Director Collabs' },
    ],
    signOffName: 'Shazzad Hossain',
  },
  contact: {
    sectionSubtitle: 'Initiate a Conversation',
    sectionHeading: 'Connect & Collaborate',
    introText:
      'For film score commissions, background music, recording projects, or bespoke production inquiries, please reach out via message or the contact form below.',
    whatsappNumber: '+1 (555) 019-2834',
    whatsappLink:
      'https://wa.me/15550192834?text=Hello%20Shazzad,%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20music%20project.',
    emailAddress: 'shazzad.music@gmail.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    spotifyUrl: 'https://open.spotify.com',
    soundcloudUrl: 'https://soundcloud.com',
    availabilityNote:
      'Available worldwide for remote composition, stems delivery, and vocal production sessions. Typical response time is within 24–48 hours.',
    formHeading: 'Send a Direct Inquiry',
    formDescription:
      'Tell me about your film, project timeline, or musical vision.',
  },
};
