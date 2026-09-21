'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  LayoutTemplate,
  User,
  Mail,
  Disc,
  ExternalLink,
  Info,
  HelpCircle,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import {
  HeroSectionData,
  AboutSectionData,
  ContactSectionData,
  AboutSpecialization,
  HeroStat,
  AboutStat,
} from '@/lib/home-data';
import { compressImageFile } from '@/lib/storage-helper';

interface HomePageEditorProps {
  onNotify: (msg: string) => void;
}

export function HomePageEditor({ onNotify }: HomePageEditorProps) {
  const {
    homeData,
    updateHeroSection,
    updateAboutSection,
    updateContactSection,
    resetHomeSectionToDefault,
  } = usePortfolio();

  // Active sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'about' | 'contact'>('hero');

  // ==========================================
  // 1. HERO FORM STATE
  // ==========================================
  const [heroBgUrl, setHeroBgUrl] = useState(homeData.hero.backgroundImageUrl);
  const [heroBgFileName, setHeroBgFileName] = useState('');
  const [heroName, setHeroName] = useState(homeData.hero.name);
  const [heroTagline, setHeroTagline] = useState(homeData.hero.tagline);
  const [heroLocation, setHeroLocation] = useState(homeData.hero.location);
  const [heroCategoryTag, setHeroCategoryTag] = useState(homeData.hero.categoryTag);
  const [heroSpecialtyTag, setHeroSpecialtyTag] = useState(homeData.hero.specialtyTag);
  const [heroDescription, setHeroDescription] = useState(homeData.hero.description);
  const [heroSecDescription, setHeroSecDescription] = useState(homeData.hero.secondaryDescription);
  const [heroBadgeText, setHeroBadgeText] = useState(homeData.hero.badgeText);
  const [heroBtn1Text, setHeroBtn1Text] = useState(homeData.hero.button1Text);
  const [heroBtn2Text, setHeroBtn2Text] = useState(homeData.hero.button2Text);
  const [heroStats, setHeroStats] = useState<[HeroStat, HeroStat, HeroStat]>([
    { ...homeData.hero.stats[0] },
    { ...homeData.hero.stats[1] },
    { ...homeData.hero.stats[2] },
  ]);
  const [heroErrors, setHeroErrors] = useState<Record<string, string>>({});
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  // ==========================================
  // 2. ABOUT ME FORM STATE
  // ==========================================
  const [aboutProfileUrl, setAboutProfileUrl] = useState(homeData.about.profileImageUrl);
  const [aboutProfileFileName, setAboutProfileFileName] = useState('');
  const [aboutQuote, setAboutQuote] = useState(homeData.about.quote);
  const [aboutSubtitle, setAboutSubtitle] = useState(homeData.about.sectionSubtitle);
  const [aboutHeading, setAboutHeading] = useState(homeData.about.sectionHeading);
  const [aboutHeadline, setAboutHeadline] = useState(homeData.about.headline);
  const [aboutBio1, setAboutBio1] = useState(homeData.about.bioParagraph1);
  const [aboutBio2, setAboutBio2] = useState(homeData.about.bioParagraph2);
  const [aboutBio3, setAboutBio3] = useState(homeData.about.bioParagraph3);
  const [aboutSpecHeading, setAboutSpecHeading] = useState(homeData.about.specializationsHeading);
  const [aboutSpecs, setAboutSpecs] = useState<AboutSpecialization[]>([
    ...homeData.about.specializations.map((s) => ({ ...s })),
  ]);
  const [aboutStats, setAboutStats] = useState<[AboutStat, AboutStat, AboutStat]>([
    { ...homeData.about.stats[0] },
    { ...homeData.about.stats[1] },
    { ...homeData.about.stats[2] },
  ]);
  const [aboutSignOff, setAboutSignOff] = useState(homeData.about.signOffName);
  const [aboutErrors, setAboutErrors] = useState<Record<string, string>>({});
  const aboutFileInputRef = useRef<HTMLInputElement | null>(null);

  // ==========================================
  // 3. CONTACT FORM STATE
  // ==========================================
  const [contactSubtitle, setContactSubtitle] = useState(homeData.contact.sectionSubtitle);
  const [contactHeading, setContactHeading] = useState(homeData.contact.sectionHeading);
  const [contactIntro, setContactIntro] = useState(homeData.contact.introText);
  const [contactWaNum, setContactWaNum] = useState(homeData.contact.whatsappNumber);
  const [contactWaLink, setContactWaLink] = useState(homeData.contact.whatsappLink);
  const [contactEmail, setContactEmail] = useState(homeData.contact.emailAddress);
  const [contactInsta, setContactInsta] = useState(homeData.contact.instagramUrl);
  const [contactYt, setContactYt] = useState(homeData.contact.youtubeUrl);
  const [contactSpotify, setContactSpotify] = useState(homeData.contact.spotifyUrl);
  const [contactSoundcloud, setContactSoundcloud] = useState(homeData.contact.soundcloudUrl);
  const [contactAvailNote, setContactAvailNote] = useState(homeData.contact.availabilityNote);
  const [contactFormHeading, setContactFormHeading] = useState(homeData.contact.formHeading);
  const [contactFormDesc, setContactFormDesc] = useState(homeData.contact.formDescription);

  // ==========================================
  // IMAGE UPLOAD HANDLERS
  // ==========================================
  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    try {
      const optimized = await compressImageFile(file, 1800, 0.88);
      setHeroBgUrl(optimized);
      setHeroBgFileName(file.name);
    } catch {
      alert('Failed to process image file. Please try a different photo.');
    }
  };

  const handleAboutPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    try {
      const optimized = await compressImageFile(file, 1200, 0.88);
      setAboutProfileUrl(optimized);
      setAboutProfileFileName(file.name);
    } catch {
      alert('Failed to process image file. Please try a different photo.');
    }
  };

  // ==========================================
  // SAVE HANDLERS
  // ==========================================
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!heroName.trim()) {
      errs.name = 'Artist name is required.';
    }
    if (!heroTagline.trim()) {
      errs.tagline = 'Tagline is required.';
    }
    if (Object.keys(errs).length > 0) {
      setHeroErrors(errs);
      return;
    }
    setHeroErrors({});

    const updates: Partial<HeroSectionData> = {
      backgroundImageUrl: heroBgUrl.trim() || homeData.hero.backgroundImageUrl,
      name: heroName.trim(),
      tagline: heroTagline.trim(),
      location: heroLocation.trim() || 'Dhaka, Bangladesh',
      categoryTag: heroCategoryTag.trim() || 'Official Artist Profile',
      specialtyTag: heroSpecialtyTag.trim() || 'Film & BGM Composer',
      description: heroDescription.trim(),
      secondaryDescription: heroSecDescription.trim(),
      badgeText: heroBadgeText.trim() || 'Studio & Scoring Suite',
      button1Text: heroBtn1Text.trim() || 'Explore Portfolio',
      button2Text: heroBtn2Text.trim() || 'Get in Touch',
      stats: [
        {
          value: heroStats[0].value.trim() || '08+',
          label: heroStats[0].label.trim() || 'Years Scoring',
        },
        {
          value: heroStats[1].value.trim() || '45+',
          label: heroStats[1].label.trim() || 'Releases',
        },
        {
          value: heroStats[2].value.trim() || '30+',
          label: heroStats[2].label.trim() || 'Collabs',
        },
      ],
    };

    updateHeroSection(updates);
    onNotify('Hero Section changes saved successfully. The public home page has been updated.');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!aboutHeading.trim()) {
      errs.heading = 'Section heading is required.';
    }
    if (!aboutBio1.trim()) {
      errs.bio = 'At least the primary biography paragraph is required.';
    }
    if (Object.keys(errs).length > 0) {
      setAboutErrors(errs);
      return;
    }
    setAboutErrors({});

    const updates: Partial<AboutSectionData> = {
      profileImageUrl: aboutProfileUrl.trim() || homeData.about.profileImageUrl,
      quote: aboutQuote.trim(),
      sectionSubtitle: aboutSubtitle.trim() || 'Biography & Philosophy',
      sectionHeading: aboutHeading.trim() || 'About Shazzad Hossain',
      headline: aboutHeadline.trim(),
      bioParagraph1: aboutBio1.trim(),
      bioParagraph2: aboutBio2.trim(),
      bioParagraph3: aboutBio3.trim(),
      specializationsHeading: aboutSpecHeading.trim() || 'Specialized Disciplines',
      specializations: aboutSpecs.map((s) => ({
        title: s.title.trim(),
        desc: s.desc.trim(),
      })),
      stats: [
        {
          value: aboutStats[0].value.trim() || '8+ Years',
          label: aboutStats[0].label.trim() || 'Experience in Industry',
        },
        {
          value: aboutStats[1].value.trim() || '45+ Works',
          label: aboutStats[1].label.trim() || 'Released Projects & Scores',
        },
        {
          value: aboutStats[2].value.trim() || '30+ Artists',
          label: aboutStats[2].label.trim() || 'Artist & Director Collabs',
        },
      ],
      signOffName: aboutSignOff.trim() || 'Shazzad Hossain',
    };

    updateAboutSection(updates);
    onNotify('About Me Section changes saved successfully. The public home page has been updated.');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<ContactSectionData> = {
      sectionSubtitle: contactSubtitle.trim() || 'Initiate a Conversation',
      sectionHeading: contactHeading.trim() || 'Connect & Collaborate',
      introText: contactIntro.trim(),
      whatsappNumber: contactWaNum.trim(),
      whatsappLink: contactWaLink.trim(),
      emailAddress: contactEmail.trim(),
      instagramUrl: contactInsta.trim(),
      youtubeUrl: contactYt.trim(),
      spotifyUrl: contactSpotify.trim(),
      soundcloudUrl: contactSoundcloud.trim(),
      availabilityNote: contactAvailNote.trim(),
      formHeading: contactFormHeading.trim() || 'Send a Direct Inquiry',
      formDescription: contactFormDesc.trim(),
    };

    updateContactSection(updates);
    onNotify('Contact Section content saved successfully. The public home page has been updated.');
  };

  // Reset Sub-section
  const handleResetSection = (section: 'hero' | 'about' | 'contact') => {
    if (
      confirm(
        `Are you sure you want to revert the ${
          section === 'hero' ? 'Hero' : section === 'about' ? 'About Me' : 'Contact'
        } section back to default content?`
      )
    ) {
      resetHomeSectionToDefault(section);
      if (section === 'hero') {
        setHeroBgUrl(homeData.hero.backgroundImageUrl);
        setHeroName(homeData.hero.name);
        setHeroTagline(homeData.hero.tagline);
        setHeroLocation(homeData.hero.location);
        setHeroCategoryTag(homeData.hero.categoryTag);
        setHeroSpecialtyTag(homeData.hero.specialtyTag);
        setHeroDescription(homeData.hero.description);
        setHeroSecDescription(homeData.hero.secondaryDescription);
        setHeroBadgeText(homeData.hero.badgeText);
        setHeroBtn1Text(homeData.hero.button1Text);
        setHeroBtn2Text(homeData.hero.button2Text);
        setHeroStats([
          { ...homeData.hero.stats[0] },
          { ...homeData.hero.stats[1] },
          { ...homeData.hero.stats[2] },
        ]);
      } else if (section === 'about') {
        setAboutProfileUrl(homeData.about.profileImageUrl);
        setAboutQuote(homeData.about.quote);
        setAboutSubtitle(homeData.about.sectionSubtitle);
        setAboutHeading(homeData.about.sectionHeading);
        setAboutHeadline(homeData.about.headline);
        setAboutBio1(homeData.about.bioParagraph1);
        setAboutBio2(homeData.about.bioParagraph2);
        setAboutBio3(homeData.about.bioParagraph3);
        setAboutSpecHeading(homeData.about.specializationsHeading);
        setAboutSpecs([...homeData.about.specializations.map((s) => ({ ...s }))]);
        setAboutStats([
          { ...homeData.about.stats[0] },
          { ...homeData.about.stats[1] },
          { ...homeData.about.stats[2] },
        ]);
        setAboutSignOff(homeData.about.signOffName);
      } else if (section === 'contact') {
        setContactSubtitle(homeData.contact.sectionSubtitle);
        setContactHeading(homeData.contact.sectionHeading);
        setContactIntro(homeData.contact.introText);
        setContactWaNum(homeData.contact.whatsappNumber);
        setContactWaLink(homeData.contact.whatsappLink);
        setContactEmail(homeData.contact.emailAddress);
        setContactInsta(homeData.contact.instagramUrl);
        setContactYt(homeData.contact.youtubeUrl);
        setContactSpotify(homeData.contact.spotifyUrl);
        setContactSoundcloud(homeData.contact.soundcloudUrl);
        setContactAvailNote(homeData.contact.availabilityNote);
        setContactFormHeading(homeData.contact.formHeading);
        setContactFormDesc(homeData.contact.formDescription);
      }
      onNotify(`Reverted ${section} section to default.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Bar: Hero Section | About Me Section | Contact Section */}
      <div className="bg-white border border-neutral-200 p-2 sm:p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('hero')}
            id="home-editor-subtab-hero"
            className={`inline-flex items-center space-x-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeSubTab === 'hero'
                ? 'bg-[#0f2b48] text-white shadow-2xs'
                : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>1. Hero Section</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('about')}
            id="home-editor-subtab-about"
            className={`inline-flex items-center space-x-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeSubTab === 'about'
                ? 'bg-[#0f2b48] text-white shadow-2xs'
                : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>2. About Me Section</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('contact')}
            id="home-editor-subtab-contact"
            className={`inline-flex items-center space-x-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeSubTab === 'contact'
                ? 'bg-[#0f2b48] text-white shadow-2xs'
                : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>3. Contact Section</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs text-neutral-500 pl-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[#0f2b48] hover:underline font-medium"
          >
            <span>Preview Public Home</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION SUB-TAB                                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="space-y-6">
          <div className="bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="font-serif-classic text-xl sm:text-2xl text-neutral-900 font-medium">
                  Hero Section Content
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Customize the background image, headings, location, category badges, descriptions, and stat counters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleResetSection('hero')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Hero</span>
              </button>
            </div>

            {/* Hero Background Photo & Preview */}
            <div className="space-y-3 bg-neutral-50/50 p-4 sm:p-5 border border-neutral-200">
              <label className="block text-xs uppercase tracking-wider text-neutral-800 font-semibold">
                Hero Background Photo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Visual Preview */}
                <div className="md:col-span-4 space-y-2">
                  <div className="relative w-full aspect-[16/10] bg-neutral-900 border border-neutral-300 overflow-hidden shadow-xs">
                    {heroBgUrl ? (
                      <Image
                        src={heroBgUrl}
                        alt="Hero background preview"
                        fill
                        unoptimized={heroBgUrl.startsWith('data:')}
                        referrerPolicy="no-referrer"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[11px]">No Photo Selected</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 block">Current Photo Preview</span>
                </div>

                {/* Upload & URL Input */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      onChange={handleHeroPhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Photo</span>
                    </button>
                    {heroBgFileName && (
                      <span className="text-xs text-neutral-600 font-mono">
                        Selected: {heroBgFileName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Upload a high-resolution landscape photo (studio portrait, instruments, or recording space). Files are automatically optimized for fast loading.
                  </p>
                  <div className="pt-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="text"
                      value={heroBgUrl}
                      onChange={(e) => setHeroBgUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Core Titles & Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Artist / Producer Name <span className="text-[#0f2b48]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  placeholder="e.g. Shazzad Hossain"
                  className={`w-full px-3.5 py-2.5 text-xs border ${
                    heroErrors.name ? 'border-red-500' : 'border-neutral-300'
                  } bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none`}
                />
                {heroErrors.name && (
                  <span className="text-[11px] text-red-600">{heroErrors.name}</span>
                )}
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Tagline / Subheading <span className="text-[#0f2b48]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  placeholder="e.g. Music Producer & Composer"
                  className={`w-full px-3.5 py-2.5 text-xs border ${
                    heroErrors.tagline ? 'border-red-500' : 'border-neutral-300'
                  } bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none`}
                />
                {heroErrors.tagline && (
                  <span className="text-[11px] text-red-600">{heroErrors.tagline}</span>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Location Text
                </label>
                <input
                  type="text"
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Specialty Tag */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Specialty Tag
                </label>
                <input
                  type="text"
                  value={heroSpecialtyTag}
                  onChange={(e) => setHeroSpecialtyTag(e.target.value)}
                  placeholder="e.g. Film & BGM Composer"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Category Pill Tag */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Category Tag (Small Pill)
                </label>
                <input
                  type="text"
                  value={heroCategoryTag}
                  onChange={(e) => setHeroCategoryTag(e.target.value)}
                  placeholder="e.g. Official Artist Profile"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Badge Text on Photo */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Small Floating Badge on Photo
                </label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) => setHeroBadgeText(e.target.value)}
                  placeholder="e.g. Studio & Scoring Suite"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>
            </div>

            {/* Description Paragraphs */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Primary Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Crafting emotive soundscapes, cinematic original scores..."
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Secondary Description Line (Optional)
                </label>
                <textarea
                  rows={2}
                  value={heroSecDescription}
                  onChange={(e) => setHeroSecDescription(e.target.value)}
                  placeholder="Specializing in background score (BGM) for indie films & series..."
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* CTA Buttons Text */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-3">
                Call To Action Buttons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Button 1 Label (Links to Portfolio)
                  </label>
                  <input
                    type="text"
                    value={heroBtn1Text}
                    onChange={(e) => setHeroBtn1Text(e.target.value)}
                    placeholder="Explore Portfolio"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-400">Target link: /portfolio (fixed)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Button 2 Label (Links to Contact)
                  </label>
                  <input
                    type="text"
                    value={heroBtn2Text}
                    onChange={(e) => setHeroBtn2Text(e.target.value)}
                    placeholder="Get in Touch"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-400">Target link: #contact (fixed)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Blocks */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-3">
                Hero Stat Counters (3 Blocks)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="p-3.5 bg-neutral-50/70 border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-semibold text-[#0f2b48] block uppercase">
                      Stat {idx + 1}
                    </span>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                        Number / Value
                      </label>
                      <input
                        type="text"
                        value={heroStats[idx].value}
                        onChange={(e) => {
                          const next = [...heroStats] as [HeroStat, HeroStat, HeroStat];
                          next[idx].value = e.target.value;
                          setHeroStats(next);
                        }}
                        placeholder="e.g. 08+"
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 font-serif-classic text-base focus:border-[#0f2b48] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                        Label
                      </label>
                      <input
                        type="text"
                        value={heroStats[idx].label}
                        onChange={(e) => {
                          const next = [...heroStats] as [HeroStat, HeroStat, HeroStat];
                          next[idx].label = e.target.value;
                          setHeroStats(next);
                        }}
                        placeholder="e.g. Years Scoring"
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-5 border-t border-neutral-200 flex items-center justify-end space-x-3">
              <button
                type="submit"
                id="save-hero-changes-btn"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Section Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 2. ABOUT ME SECTION SUB-TAB                                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="space-y-6">
          <div className="bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="font-serif-classic text-xl sm:text-2xl text-neutral-900 font-medium">
                  About Me Section Content
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your artist bio, studio philosophy, profile portrait, specialized disciplines, and career stats.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleResetSection('about')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset About Me</span>
              </button>
            </div>

            {/* Profile Photo & Preview */}
            <div className="space-y-3 bg-neutral-50/50 p-4 sm:p-5 border border-neutral-200">
              <label className="block text-xs uppercase tracking-wider text-neutral-800 font-semibold">
                Profile Portrait Photo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Visual Preview */}
                <div className="md:col-span-4 space-y-2">
                  <div className="relative w-full aspect-[3/4] bg-neutral-900 border border-neutral-300 overflow-hidden shadow-xs">
                    {aboutProfileUrl ? (
                      <Image
                        src={aboutProfileUrl}
                        alt="Profile portrait preview"
                        fill
                        unoptimized={aboutProfileUrl.startsWith('data:')}
                        referrerPolicy="no-referrer"
                        className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                        <User className="w-8 h-8 mb-1" />
                        <span className="text-[11px]">No Photo Selected</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 block">Current Portrait Preview</span>
                </div>

                {/* Upload & URL Input */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={aboutFileInputRef}
                      onChange={handleAboutPhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => aboutFileInputRef.current?.click()}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Profile Portrait</span>
                    </button>
                    {aboutProfileFileName && (
                      <span className="text-xs text-neutral-600 font-mono">
                        Selected: {aboutProfileFileName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Upload a portrait orientation photo (3:4 ratio recommended) of you composing, recording, or in the studio.
                  </p>
                  <div className="pt-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="text"
                      value={aboutProfileUrl}
                      onChange={(e) => setAboutProfileUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                    />
                  </div>

                  {/* Caption quote under photo */}
                  <div className="pt-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                      Short Quote under Photo
                    </label>
                    <input
                      type="text"
                      value={aboutQuote}
                      onChange={(e) => setAboutQuote(e.target.value)}
                      placeholder='“Every scene and story has an inherent rhythm...”'
                      className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none italic"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Section Subtitle (Category Tag)
                </label>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  placeholder="Biography & Philosophy"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Section Heading <span className="text-[#0f2b48]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={aboutHeading}
                  onChange={(e) => setAboutHeading(e.target.value)}
                  placeholder="About Shazzad Hossain"
                  className={`w-full px-3.5 py-2.5 text-xs border ${
                    aboutErrors.heading ? 'border-red-500' : 'border-neutral-300'
                  } bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none`}
                />
                {aboutErrors.heading && (
                  <span className="text-[11px] text-red-600">{aboutErrors.heading}</span>
                )}
              </div>
            </div>

            {/* Headline / Statement */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                Philosophy Headline
              </label>
              <input
                type="text"
                value={aboutHeadline}
                onChange={(e) => setAboutHeadline(e.target.value)}
                placeholder="A commitment to narrative depth, organic acoustics, and sonic restraint."
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none font-serif-classic text-sm"
              />
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Biography Paragraph 1 (Introduction & Journey) <span className="text-[#0f2b48]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={aboutBio1}
                  onChange={(e) => setAboutBio1(e.target.value)}
                  placeholder="Hello, I am Shazzad Hossain — a music producer and composer based in the studio..."
                  className={`w-full px-3.5 py-2.5 text-xs border ${
                    aboutErrors.bio ? 'border-red-500' : 'border-neutral-300'
                  } bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y leading-relaxed`}
                />
                {aboutErrors.bio && (
                  <span className="text-[11px] text-red-600">{aboutErrors.bio}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Biography Paragraph 2 (Specialization & Film Scoring)
                </label>
                <textarea
                  rows={4}
                  value={aboutBio2}
                  onChange={(e) => setAboutBio2(e.target.value)}
                  placeholder="I specialize in creating bespoke background scores (BGM) for independent films..."
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Biography Paragraph 3 (Studio Ethics & Acoustics)
                </label>
                <textarea
                  rows={3}
                  value={aboutBio3}
                  onChange={(e) => setAboutBio3(e.target.value)}
                  placeholder="Rather than chasing fleeting digital production fads, my studio practice is anchored in..."
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* Specialized Disciplines (Specialty / Skills) */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                  Specialized Disciplines / Skills Grid
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutSpecs.map((spec, idx) => (
                  <div key={idx} className="p-3.5 bg-neutral-50/70 border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-semibold text-[#0f2b48] block uppercase">
                      Skill Discipline {idx + 1}
                    </span>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                        Discipline Title
                      </label>
                      <input
                        type="text"
                        value={spec.title}
                        onChange={(e) => {
                          const next = [...aboutSpecs];
                          next[idx].title = e.target.value;
                          setAboutSpecs(next);
                        }}
                        placeholder="e.g. Film & Media Scoring (BGM)"
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 font-medium focus:border-[#0f2b48] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={spec.desc}
                        onChange={(e) => {
                          const next = [...aboutSpecs];
                          next[idx].desc = e.target.value;
                          setAboutSpecs(next);
                        }}
                        placeholder="Cinematic compositions tailored to narrative pacing..."
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Snapshot Stats */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-3">
                Career Snapshot Stats (3 Metrics)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="p-3.5 bg-neutral-50/70 border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-semibold text-[#0f2b48] block uppercase">
                      Snapshot {idx + 1}
                    </span>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                        Value
                      </label>
                      <input
                        type="text"
                        value={aboutStats[idx].value}
                        onChange={(e) => {
                          const next = [...aboutStats] as [AboutStat, AboutStat, AboutStat];
                          next[idx].value = e.target.value;
                          setAboutStats(next);
                        }}
                        placeholder="e.g. 8+ Years"
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 font-serif-classic text-base focus:border-[#0f2b48] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                        Label
                      </label>
                      <input
                        type="text"
                        value={aboutStats[idx].label}
                        onChange={(e) => {
                          const next = [...aboutStats] as [AboutStat, AboutStat, AboutStat];
                          next[idx].label = e.target.value;
                          setAboutStats(next);
                        }}
                        placeholder="e.g. Experience in Industry"
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign-off Name */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="max-w-xs space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Sign-off Name / Signature
                </label>
                <input
                  type="text"
                  value={aboutSignOff}
                  onChange={(e) => setAboutSignOff(e.target.value)}
                  placeholder="Shazzad Hossain"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none font-serif-classic italic text-base"
                />
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-5 border-t border-neutral-200 flex items-center justify-end space-x-3">
              <button
                type="submit"
                id="save-about-changes-btn"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save About Me Section Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. CONTACT SECTION SUB-TAB                                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="space-y-6">
          <div className="bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="font-serif-classic text-xl sm:text-2xl text-neutral-900 font-medium">
                  Contact Section Content
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your direct communication channels, WhatsApp link, studio email, streaming/social profiles, and descriptive text.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleResetSection('contact')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white text-neutral-700 text-xs font-medium uppercase tracking-wider transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Contact</span>
              </button>
            </div>

            {/* Note banner explaining contact form fields */}
            <div className="p-3.5 bg-sky-50 border border-sky-200 flex items-start space-x-2.5 text-sky-950 text-xs">
              <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Note:</strong> The interactive Contact Form input fields (Name, Email, Message) remain active to receive client inquiries. This editor configures the headings, WhatsApp, email, social links, and surrounding descriptive text.
              </p>
            </div>

            {/* Section Heading & Intro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={contactSubtitle}
                  onChange={(e) => setContactSubtitle(e.target.value)}
                  placeholder="Initiate a Conversation"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={contactHeading}
                  onChange={(e) => setContactHeading(e.target.value)}
                  placeholder="Connect & Collaborate"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none font-serif-classic text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                Section Introduction Text
              </label>
              <textarea
                rows={2}
                value={contactIntro}
                onChange={(e) => setContactIntro(e.target.value)}
                placeholder="For film score commissions, background music, recording projects..."
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y"
              />
            </div>

            {/* Direct Channels: WhatsApp & Email */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Direct Channels (WhatsApp & Official Email)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    WhatsApp Display Number
                  </label>
                  <input
                    type="text"
                    value={contactWaNum}
                    onChange={(e) => setContactWaNum(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    WhatsApp Click-to-Chat URL
                  </label>
                  <input
                    type="text"
                    value={contactWaLink}
                    onChange={(e) => setContactWaLink(e.target.value)}
                    placeholder="https://wa.me/15550192834?text=Hello..."
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Official Studio Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="shazzad.music@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Media & Streaming Profiles */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Streaming & Social Profiles URLs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={contactInsta}
                    onChange={(e) => setContactInsta(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    YouTube Official Channel URL
                  </label>
                  <input
                    type="text"
                    value={contactYt}
                    onChange={(e) => setContactYt(e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Spotify Artist URL
                  </label>
                  <input
                    type="text"
                    value={contactSpotify}
                    onChange={(e) => setContactSpotify(e.target.value)}
                    placeholder="https://open.spotify.com/artist/..."
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    SoundCloud Profile URL
                  </label>
                  <input
                    type="text"
                    value={contactSoundcloud}
                    onChange={(e) => setContactSoundcloud(e.target.value)}
                    placeholder="https://soundcloud.com/..."
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Surrounding Texts: Availability Note & Form Header */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Form & Working Notice Texts
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Availability Note / Working Timeline
                </label>
                <textarea
                  rows={2}
                  value={contactAvailNote}
                  onChange={(e) => setContactAvailNote(e.target.value)}
                  placeholder="Available worldwide for remote composition, stems delivery, and vocal production..."
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Contact Form Box Heading
                  </label>
                  <input
                    type="text"
                    value={contactFormHeading}
                    onChange={(e) => setContactFormHeading(e.target.value)}
                    placeholder="Send a Direct Inquiry"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                    Contact Form Box Subheading
                  </label>
                  <input
                    type="text"
                    value={contactFormDesc}
                    onChange={(e) => setContactFormDesc(e.target.value)}
                    placeholder="Tell me about your film, project timeline, or musical vision."
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-5 border-t border-neutral-200 flex items-center justify-end space-x-3">
              <button
                type="submit"
                id="save-contact-changes-btn"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0f2b48] hover:bg-[#163a5f] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact Section Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
