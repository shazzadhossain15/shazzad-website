export interface PlatformLink {
  name: string;
  action: 'Listen' | 'Watch';
  url: string;
  platform: 'spotify' | 'apple-music' | 'youtube-music' | 'music-video' | 'deezer' | 'tidal' | 'soundcloud';
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'Film & BGM' | 'Collaboration' | 'Original Works';
  year: string;
  duration: string;
  bpm: number;
  key: string;
  role: string;
  collaborators: string[];
  collaborationNote?: string;
  coverUrl: string;
  shortDescription: string;
  fullNote: string;
  musicalFocus: string[];
  spotifyUrl: string;
  appleMusicUrl: string;
  youtubeUrl: string;
  soundcloudUrl: string;
  videoClipUrl?: string; // Optional 30s background music video clip
  platforms: PlatformLink[];
  audioNotes?: number[]; // Frequencies for Web Audio ambient preview
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'solitude-in-c-minor',
    title: 'Solitude in C Minor',
    category: 'Film & BGM',
    year: '2024',
    duration: '4:18',
    bpm: 72,
    key: 'C Minor',
    role: 'Composer, Arranger & Mixer',
    collaborators: ['London Contemporary Chamber Ensemble', 'Claire Dupont (Cello)'],
    collaborationNote:
      "Commissioned as the main thematic score for the independent psychological drama 'The Quiet Threshold', this piece arose from an acoustic dialogue with Claire Dupont and the London Contemporary Chamber Ensemble. Recorded inside a stone sanctuary to capture natural reverberant tails, close-mic'd Upright Felt Piano is layered with Dupont's cello harmonics and soft analog sub-harmonics. The arrangement gently articulates the protagonist's inner isolation, balancing acoustic vulnerability with cinematic depth.",
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
    videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    shortDescription: 'Atmospheric cinematic score featuring melancholic cello, Felt Piano, and subtle analog synth textures.',
    fullNote:
      'Commissioned as the main theme for the independent psychological drama "The Quiet Threshold". The goal was to articulate the protagonist\'s isolation without overwhelming the dialogue. We recorded close-mic\'d Upright Felt Piano layered with lush cello harmonics and soft Roland Juno-60 pads.',
    musicalFocus: ['Upright Felt Piano', 'Solo Cello', 'Analog Sub-bass', 'Granular Reverb'],
    spotifyUrl: 'https://open.spotify.com',
    appleMusicUrl: 'https://music.apple.com',
    youtubeUrl: 'https://youtube.com',
    soundcloudUrl: 'https://soundcloud.com',
    platforms: [
      { name: 'Spotify', action: 'Listen', url: 'https://open.spotify.com', platform: 'spotify' },
      { name: 'Apple Music', action: 'Listen', url: 'https://music.apple.com', platform: 'apple-music' },
      { name: 'YouTube Music', action: 'Listen', url: 'https://music.youtube.com', platform: 'youtube-music' },
      { name: 'Official Music Video (YouTube)', action: 'Watch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', platform: 'music-video' },
      { name: 'Deezer', action: 'Listen', url: 'https://www.deezer.com', platform: 'deezer' },
      { name: 'Tidal', action: 'Listen', url: 'https://tidal.com', platform: 'tidal' },
    ],
    audioNotes: [261.63, 311.13, 392.0, 523.25], // C minor chord
  },
  {
    id: 'mirage-drift',
    title: 'Mirage Drift',
    category: 'Collaboration',
    year: '2024',
    duration: '3:35',
    bpm: 98,
    key: 'F# Minor',
    role: 'Music Producer, Sound Designer & Master',
    collaborators: ['Zayn Al-Mansoor (Oud & Vocals)', 'Maya Thorne (Acoustic Percussion)'],
    collaborationNote:
      "Produced across London and Istanbul, this collaboration unites Zayn Al-Mansoor's microtonal 11-string oud with Maya Thorne's tactile frame percussion. The foundation was built upon an improvised acoustic oud motif, routed through vintage tape saturators and counterbalanced with crisp UK garage syncopation. The result merges Eastern modal heritage with contemporary low-end drive while maintaining complete acoustic warmth.",
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85',
    videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    shortDescription: 'Contemporary electronic production fused with microtonal Eastern acoustic instruments and deep basslines.',
    fullNote:
      'A cross-continental collaboration bridging traditional acoustic Middle Eastern instrumentation with modern UK garage-infused rhythms. Built around an improvised 11-string Oud motif recorded in Istanbul, processed through custom tape delays and modern punchy drum architecture.',
    musicalFocus: ['11-String Acoustic Oud', 'Warm 808s', 'Tape Saturation', 'Poly-meter Percussion'],
    spotifyUrl: 'https://open.spotify.com',
    appleMusicUrl: 'https://music.apple.com',
    youtubeUrl: 'https://youtube.com',
    soundcloudUrl: 'https://soundcloud.com',
    platforms: [
      { name: 'Spotify', action: 'Listen', url: 'https://open.spotify.com', platform: 'spotify' },
      { name: 'Apple Music', action: 'Listen', url: 'https://music.apple.com', platform: 'apple-music' },
      { name: 'YouTube Music', action: 'Listen', url: 'https://music.youtube.com', platform: 'youtube-music' },
      { name: 'Official Music Video (YouTube)', action: 'Watch', url: 'https://www.youtube.com', platform: 'music-video' },
      { name: 'Deezer', action: 'Listen', url: 'https://www.deezer.com', platform: 'deezer' },
      { name: 'Tidal', action: 'Listen', url: 'https://tidal.com', platform: 'tidal' },
    ],
    audioNotes: [185.0, 220.0, 277.18, 369.99], // F# minor
  },
  {
    id: 'nocturne-echoes',
    title: 'Nocturne Echoes',
    category: 'Original Works',
    year: '2023',
    duration: '5:02',
    bpm: 64,
    key: 'D Minor',
    role: 'Composer & Producer',
    collaborators: ['Solo Project', 'Featuring Nordic Horn Quartet (Guest Brass)'],
    collaborationNote:
      "Written during a winter residency in Bergen, this neoclassical work explores nocturnal acoustics and cathedral resonance. Sustained brass swells from the Nordic Horn Quartet were captured in a historic hall, resting beneath felted upright piano motifs and gentle analog tape noise. The composition leverages spacious pacing and organic room reverberation to craft an immersive, contemplative atmosphere.",
    coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Neoclassical ambient composition blending muted piano with sweeping orchestral brass and tape noise.',
    fullNote:
      'Written during a winter residency in Bergen. The piece explores nocturnal acoustics, silence, and the resonance of wooden instruments in a cathedral hall. Produced entirely using valve preamps and analog outboard gear for natural warmth.',
    musicalFocus: ['Cathedral Reverb', 'French Horn', 'Bowed Strings', 'Muted Piano'],
    spotifyUrl: 'https://open.spotify.com',
    appleMusicUrl: 'https://music.apple.com',
    youtubeUrl: 'https://youtube.com',
    soundcloudUrl: 'https://soundcloud.com',
    platforms: [
      { name: 'Spotify', action: 'Listen', url: 'https://open.spotify.com', platform: 'spotify' },
      { name: 'Apple Music', action: 'Listen', url: 'https://music.apple.com', platform: 'apple-music' },
      { name: 'YouTube Music', action: 'Listen', url: 'https://music.youtube.com', platform: 'youtube-music' },
      { name: 'Official Music Video (YouTube)', action: 'Watch', url: 'https://www.youtube.com', platform: 'music-video' },
      { name: 'Deezer', action: 'Listen', url: 'https://www.deezer.com', platform: 'deezer' },
      { name: 'Tidal', action: 'Listen', url: 'https://tidal.com', platform: 'tidal' },
    ],
    audioNotes: [293.66, 349.23, 440.0, 587.33], // D minor
  },
  {
    id: 'neon-aurora',
    title: 'Neon Aurora',
    category: 'Film & BGM',
    year: '2023',
    duration: '3:50',
    bpm: 110,
    key: 'A Minor',
    role: 'Composer, Synthesist & Audio Engineer',
    collaborators: ['Studio Horizon Sci-Fi Shorts', 'Eva Lindqvist (Vocal Ambient Choirs)'],
    collaborationNote:
      "Created for the pivotal sequence of the sci-fi short 'The Signal from Sector 9', this composition bridges cold dystopian electronics with organic human warmth. Eva Lindqvist's wordless vocal improvisations were tracked through bucket-brigade analog delays and paired against sequential Prophet-5 modular synthesizer arpeggios. The arrangement balances driving industrial percussions with lush harmonic risers to evoke a bittersweet sense of wonder.",
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85',
    videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    shortDescription: 'Cinematic cyberpunk background score with Prophet-5 modular synthesizer arpeggios and ethereal vocals.',
    fullNote:
      'Created as the pivotal sequence score for the indie sci-fi short "The Signal from Sector 9". Balancing cold dystopian industrial percussions with warm, human vocal layers to create a bittersweet sense of wonder.',
    musicalFocus: ['Prophet-5 Synthesizer', 'Moog Sub Phatty', 'Ethereal Choirs', 'Dynamic Risers'],
    spotifyUrl: 'https://open.spotify.com',
    appleMusicUrl: 'https://music.apple.com',
    youtubeUrl: 'https://youtube.com',
    soundcloudUrl: 'https://soundcloud.com',
    platforms: [
      { name: 'Spotify', action: 'Listen', url: 'https://open.spotify.com', platform: 'spotify' },
      { name: 'Apple Music', action: 'Listen', url: 'https://music.apple.com', platform: 'apple-music' },
      { name: 'YouTube Music', action: 'Listen', url: 'https://music.youtube.com', platform: 'youtube-music' },
      { name: 'Official Music Video (YouTube)', action: 'Watch', url: 'https://www.youtube.com', platform: 'music-video' },
      { name: 'Deezer', action: 'Listen', url: 'https://www.deezer.com', platform: 'deezer' },
      { name: 'Tidal', action: 'Listen', url: 'https://tidal.com', platform: 'tidal' },
    ],
    audioNotes: [220.0, 261.63, 329.63, 440.0], // A minor
  },
  {
    id: 'whispers-of-autumn',
    title: 'Whispers of Autumn',
    category: 'Collaboration',
    year: '2023',
    duration: '3:20',
    bpm: 84,
    key: 'G Major',
    role: 'Producer, Arranger & Acoustic Guitarist',
    collaborators: ['Hannah Ross (Lead Vocalist & Lyricist)', 'Tarek Rahman (Bansuri Flute)'],
    collaborationNote:
      "Recorded live during an unhurried single-room session, this indie-folk ballad centers on the organic dialogue between Hannah Ross's intimate vocals and Tarek Rahman's North Indian bansuri flute. A vintage Neumann U87 captured natural room reflections, delicate breathwork, and fingerpicked Martin acoustic guitar accompaniment. The production remains deliberately unadorned, preserving natural dynamics and emotional intimacy.",
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Intimate indie-folk ballad with organic fingerpicked guitar, warm vocal stacks, and bamboo flute countermelodies.',
    fullNote:
      'A stripped-back, heart-led production. Recorded live in a single session with Neumann U87s, preserving the natural room reflections and breath work. Mastered gently with dynamic headroom intact.',
    musicalFocus: ['Martin D-28 Acoustic', 'Bansuri Flute', 'Ribbon Mics', 'Warm Plate Reverb'],
    spotifyUrl: 'https://open.spotify.com',
    appleMusicUrl: 'https://music.apple.com',
    youtubeUrl: 'https://youtube.com',
    soundcloudUrl: 'https://soundcloud.com',
    platforms: [
      { name: 'Spotify', action: 'Listen', url: 'https://open.spotify.com', platform: 'spotify' },
      { name: 'Apple Music', action: 'Listen', url: 'https://music.apple.com', platform: 'apple-music' },
      { name: 'YouTube Music', action: 'Listen', url: 'https://music.youtube.com', platform: 'youtube-music' },
      { name: 'Official Music Video (YouTube)', action: 'Watch', url: 'https://www.youtube.com', platform: 'music-video' },
      { name: 'Deezer', action: 'Listen', url: 'https://www.deezer.com', platform: 'deezer' },
      { name: 'Tidal', action: 'Listen', url: 'https://tidal.com', platform: 'tidal' },
    ],
    audioNotes: [196.0, 246.94, 293.66, 392.0], // G major
  },
  {
    id: 'chronicles-of-the-sea',
    title: 'Chronicles of the Sea',
    category: 'Film & BGM',
    year: '2022',
    duration: '6:15',
    bpm: 60,
    key: 'E Minor',
    role: 'Orchestrator & Score Producer',
    collaborators: ['Blue Planet Ocean Documentary', 'Prague Philharmonic Strings'],
    collaborationNote:
      "Composed for the abyssal sequence of an international marine documentary, this orchestral suite mirrors the surge and depth of oceanic currents. Recorded with the Prague Philharmonic Strings, sweeping bowed movements were layered with resonant French horn swells and ceremonial taiko percussions. The music ebbs and flows with the tides before building into a dramatic crescendo that reveals the grandeur of deep-sea ecosystems.",
    coverUrl: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=format&fit=crop&w=1200&q=85',
    videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    shortDescription: 'Epic maritime orchestral suite featuring dynamic brass swells, taiko drums, and rolling piano waves.',
    fullNote:
      'Original score for an environmental marine documentary episode. The music ebbs and flows like oceanic tides, culminating in a dramatic crescendo as deep-sea ecosystems are revealed.',
    musicalFocus: ['Full String Orchestra', 'Tubular Bells', 'Orchestral Taikos', 'French Horn Solos'],
    spotifyUrl: 'https://open.spotify.com',
    appleMusicUrl: 'https://music.apple.com',
    youtubeUrl: 'https://youtube.com',
    soundcloudUrl: 'https://soundcloud.com',
    platforms: [
      { name: 'Spotify', action: 'Listen', url: 'https://open.spotify.com', platform: 'spotify' },
      { name: 'Apple Music', action: 'Listen', url: 'https://music.apple.com', platform: 'apple-music' },
      { name: 'YouTube Music', action: 'Listen', url: 'https://music.youtube.com', platform: 'youtube-music' },
      { name: 'Official Music Video (YouTube)', action: 'Watch', url: 'https://www.youtube.com', platform: 'music-video' },
      { name: 'Deezer', action: 'Listen', url: 'https://www.deezer.com', platform: 'deezer' },
      { name: 'Tidal', action: 'Listen', url: 'https://tidal.com', platform: 'tidal' },
    ],
    audioNotes: [164.81, 196.0, 246.94, 329.63], // E minor
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  if (!slug) return undefined;
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  return PORTFOLIO_PROJECTS.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === normalized ||
      p.title.toLowerCase() === normalized
  );
}
