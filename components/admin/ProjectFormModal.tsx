'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Music2,
  Apple,
  Headphones,
  Sliders,
  Waves,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PortfolioProject, PlatformLink } from '@/lib/portfolio-data';
import { compressImageFile } from '@/lib/storage-helper';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<PortfolioProject>) => void;
  initialProject?: PortfolioProject | null;
}

function ProjectFormModalContent({
  onClose,
  onSave,
  initialProject,
}: Omit<ProjectFormModalProps, 'isOpen'>) {
  const isEditing = Boolean(initialProject);

  // Form State initialized directly from props (no useEffect needed)
  const [title, setTitle] = useState(initialProject?.title || '');
  const [category, setCategory] = useState<PortfolioProject['category']>(
    initialProject?.category || 'Film & BGM'
  );
  const [year, setYear] = useState(
    initialProject?.year || new Date().getFullYear().toString()
  );
  const [collaboratorsText, setCollaboratorsText] = useState(
    initialProject?.collaborators?.join(', ') || ''
  );
  const [shortDescription, setShortDescription] = useState(
    initialProject?.shortDescription || ''
  );
  const [collaborationNote, setCollaborationNote] = useState(
    initialProject?.collaborationNote || initialProject?.fullNote || ''
  );
  const [role, setRole] = useState(
    initialProject?.role || 'Composer, Arranger & Mixer'
  );

  // Media Assets
  const [coverUrl, setCoverUrl] = useState(initialProject?.coverUrl || '');
  const [coverFileName, setCoverFileName] = useState('');
  const [videoClipUrl, setVideoClipUrl] = useState(
    initialProject?.videoClipUrl || ''
  );
  const [videoFileName, setVideoFileName] = useState('');

  // Initial platform links
  const spotify = initialProject?.platforms?.find((p) => p.platform === 'spotify');
  const apple = initialProject?.platforms?.find((p) => p.platform === 'apple-music');
  const ytMusic = initialProject?.platforms?.find((p) => p.platform === 'youtube-music');
  const video = initialProject?.platforms?.find((p) => p.platform === 'music-video');
  const deezer = initialProject?.platforms?.find((p) => p.platform === 'deezer');
  const tidal = initialProject?.platforms?.find((p) => p.platform === 'tidal');

  const [spotifyUrl, setSpotifyUrl] = useState(spotify?.url || initialProject?.spotifyUrl || '');
  const [appleMusicUrl, setAppleMusicUrl] = useState(apple?.url || initialProject?.appleMusicUrl || '');
  const [youtubeMusicUrl, setYoutubeMusicUrl] = useState(ytMusic?.url || initialProject?.youtubeUrl || '');
  const [musicVideoUrl, setMusicVideoUrl] = useState(video?.url || '');
  const [deezerUrl, setDeezerUrl] = useState(deezer?.url || '');
  const [tidalUrl, setTidalUrl] = useState(tidal?.url || '');

  // Validation & Feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Cover Art File Upload with automatic compression
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, cover: 'Please select a valid image file (JPEG/PNG/WebP).' }));
      return;
    }

    setCoverFileName(file.name);
    try {
      // Compress to high-resolution web-optimized format (1600px square max, 88% quality)
      const compressedDataUrl = await compressImageFile(file, 1600, 0.88);
      setCoverUrl(compressedDataUrl);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cover;
        return next;
      });
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCoverUrl(result);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.cover;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Background Video Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrors((prev) => ({ ...prev, video: 'Please select a valid video file (MP4/WebM).' }));
      return;
    }

    setVideoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setVideoClipUrl(result);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.video;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Song/Project title is required.';
    }
    if (!coverUrl.trim()) {
      newErrors.cover = 'Cover Art image is required (3000x3000px high-resolution recommended).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Assemble Platform Links array
    const platforms: PlatformLink[] = [];
    if (spotifyUrl.trim()) {
      platforms.push({ name: 'Spotify', action: 'Listen', url: spotifyUrl.trim(), platform: 'spotify' });
    }
    if (appleMusicUrl.trim()) {
      platforms.push({ name: 'Apple Music', action: 'Listen', url: appleMusicUrl.trim(), platform: 'apple-music' });
    }
    if (youtubeMusicUrl.trim()) {
      platforms.push({ name: 'YouTube Music', action: 'Listen', url: youtubeMusicUrl.trim(), platform: 'youtube-music' });
    }
    if (musicVideoUrl.trim()) {
      platforms.push({ name: 'Official Music Video (YouTube)', action: 'Watch', url: musicVideoUrl.trim(), platform: 'music-video' });
    }
    if (deezerUrl.trim()) {
      platforms.push({ name: 'Deezer', action: 'Listen', url: deezerUrl.trim(), platform: 'deezer' });
    }
    if (tidalUrl.trim()) {
      platforms.push({ name: 'Tidal', action: 'Listen', url: tidalUrl.trim(), platform: 'tidal' });
    }

    // Parse collaborators
    const collaboratorsList = collaboratorsText
      .split(/[,&]/)
      .map((c) => c.trim())
      .filter(Boolean);

    const projectPayload: Partial<PortfolioProject> = {
      title: title.trim(),
      category,
      year: year.trim() || new Date().getFullYear().toString(),
      role: role.trim() || 'Composer & Producer',
      collaborators: collaboratorsList.length > 0 ? collaboratorsList : ['Shazzad Hossain'],
      shortDescription: shortDescription.trim() || `${title.trim()} composed and arranged by Shazzad Hossain.`,
      collaborationNote: collaborationNote.trim() || shortDescription.trim(),
      coverUrl: coverUrl.trim(),
      videoClipUrl: videoClipUrl.trim() || undefined,
      platforms,
      spotifyUrl: spotifyUrl.trim() || undefined,
      appleMusicUrl: appleMusicUrl.trim() || undefined,
      youtubeUrl: youtubeMusicUrl.trim() || musicVideoUrl.trim() || undefined,
    };

    onSave(projectPayload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl my-6 bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-950 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0f2b48]">
            {isEditing ? 'Editing Repertoire Entry' : 'New Repertoire Entry'}
          </span>
          <h2 id="project-modal-title" className="font-serif-classic text-2xl sm:text-3xl text-neutral-950 font-normal mt-1">
            {isEditing ? `Edit: ${initialProject?.title}` : 'Add Music Portfolio Project'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage public portfolio attributes, 3000x3000px cover artwork, optional 30s background video, and streaming links.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Song Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1.5 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0f2b48]" />
              <span>1. Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Song / Project Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.title;
                        return n;
                      });
                    }
                  }}
                  placeholder="e.g. Echoes of the Bosphorus"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
                {errors.title && (
                  <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PortfolioProject['category'])}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                >
                  <option value="Film & BGM">Film & BGM</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Original Works">Original Works</option>
                </select>
                <p className="text-[11px] text-neutral-400">
                  Matches the category filter tabs on the Portfolio page.
                </p>
              </div>

              {/* Release Year */}
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Release Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Collaborators */}
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Collaborator Name(s)
                </label>
                <input
                  type="text"
                  value={collaboratorsText}
                  onChange={(e) => setCollaboratorsText(e.target.value)}
                  placeholder="e.g. Zayn Al-Mansoor (Oud & Vocals) & Maya Thorne (Acoustic Percussion)"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
                <p className="text-[11px] text-neutral-400">
                  Separate multiple artists with comma or &apos;&amp;&apos;.
                </p>
              </div>

              {/* Primary Role */}
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Your Role & Credits
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Composer, Arranger & Mixer"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Short Description / Tagline
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. An atmospheric Middle Eastern-Nordic acoustic blend blending microtonal oud with contemporary string textures."
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
                <p className="text-[11px] text-neutral-400">
                  Shown in the hero header and portfolio card previews.
                </p>
              </div>

              {/* Collaboration & Project Notes */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Collaboration & Project Notes
                </label>
                <textarea
                  rows={3}
                  value={collaborationNote}
                  onChange={(e) => setCollaborationNote(e.target.value)}
                  placeholder="Provide comprehensive creative context: arrangement dialogue, acoustic tuning, instruments utilized, and artistic purpose..."
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none leading-relaxed"
                />
                <p className="text-[11px] text-neutral-400">
                  Displayed under the &apos;Collaboration & Project Notes&apos; dossier on the song detail page.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Media Assets */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1.5 flex items-center space-x-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#0f2b48]" />
              <span>2. Visual & Media Assets</span>
            </h3>

            {/* Cover Art (3000x3000px) */}
            <div className="space-y-2 p-4 bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-wider text-neutral-800 font-medium">
                  Cover Art Image <span className="text-red-600">*</span>
                </label>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-neutral-200 text-neutral-700 px-2 py-0.5">
                  Target: 3000 × 3000 px Square
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {/* Image Live Preview */}
                <div className="relative aspect-square w-full sm:w-36 bg-neutral-200 border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt="Cover Art Preview"
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  ) : (
                    <div className="text-center p-3 text-neutral-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[10px]">No Artwork</span>
                    </div>
                  )}
                </div>

                {/* Upload & URL Controls */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      id="upload-cover-btn"
                      className="inline-flex items-center justify-center space-x-2 px-3.5 py-2 bg-white border border-neutral-300 hover:border-neutral-500 text-xs font-medium text-neutral-800 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0f2b48]" />
                      <span>{coverFileName ? 'Replace File' : 'Upload Image File'}</span>
                    </button>
                    {coverFileName && (
                      <span className="text-xs text-neutral-600 flex items-center self-center truncate">
                        Selected: {coverFileName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-500">Or direct image URL:</span>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => {
                        setCoverUrl(e.target.value);
                        if (errors.cover) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.cover;
                            return n;
                          });
                        }
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none font-mono"
                    />
                  </div>

                  {errors.cover && (
                    <p className="text-xs text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.cover}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Background Video (30s max) */}
            <div className="space-y-2 p-4 bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-wider text-neutral-800 font-medium">
                  Optional Background Video (Song Detail Hero)
                </label>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-neutral-200 text-neutral-700 px-2 py-0.5">
                  Max 30s Loop &bull; Autoplay Muted
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                If left empty, your 3000x3000px cover artwork will automatically be used as the high-contrast hero background.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start pt-1">
                {/* Video Preview */}
                <div className="relative aspect-video w-full sm:w-44 bg-neutral-900 border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0">
                  {videoClipUrl ? (
                    <video
                      src={videoClipUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3 text-neutral-500">
                      <Video className="w-6 h-6 mx-auto mb-1 opacity-40" />
                      <span className="text-[10px]">Cover Art Fallback</span>
                    </div>
                  )}
                </div>

                {/* Upload & URL Controls */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      id="upload-video-btn"
                      className="inline-flex items-center justify-center space-x-2 px-3.5 py-2 bg-white border border-neutral-300 hover:border-neutral-500 text-xs font-medium text-neutral-800 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0f2b48]" />
                      <span>{videoFileName ? 'Replace Video' : 'Upload Video File'}</span>
                    </button>
                    {videoClipUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setVideoClipUrl('');
                          setVideoFileName('');
                        }}
                        className="text-xs text-neutral-500 hover:text-red-600 underline"
                      >
                        Remove Video
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-500">Or direct video link (MP4 / WebM):</span>
                    <input
                      type="url"
                      value={videoClipUrl}
                      onChange={(e) => setVideoClipUrl(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/.../clip.mp4"
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Platform Links */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-neutral-100 pb-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
                <Headphones className="w-3.5 h-3.5 text-[#0f2b48]" />
                <span>3. Official Platform Links</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Leave empty if not released on a specific platform. If empty, that platform&apos;s button will not appear on the Song Detail Page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Spotify */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 flex items-center space-x-1.5">
                  <Music2 className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Spotify URL</span>
                </label>
                <input
                  type="url"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Apple Music */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 flex items-center space-x-1.5">
                  <Apple className="w-3.5 h-3.5 text-[#FC3C44]" />
                  <span>Apple Music URL</span>
                </label>
                <input
                  type="url"
                  value={appleMusicUrl}
                  onChange={(e) => setAppleMusicUrl(e.target.value)}
                  placeholder="https://music.apple.com/us/album/..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* YouTube Music */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 flex items-center space-x-1.5">
                  <Headphones className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>YouTube Music URL</span>
                </label>
                <input
                  type="url"
                  value={youtubeMusicUrl}
                  onChange={(e) => setYoutubeMusicUrl(e.target.value)}
                  placeholder="https://music.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Official Music Video */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 flex items-center space-x-1.5">
                  <Video className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Official Music Video (YouTube) URL</span>
                </label>
                <input
                  type="url"
                  value={musicVideoUrl}
                  onChange={(e) => setMusicVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Deezer */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#A238FF]" />
                  <span>Deezer URL</span>
                </label>
                <input
                  type="url"
                  value={deezerUrl}
                  onChange={(e) => setDeezerUrl(e.target.value)}
                  placeholder="https://deezer.com/track/..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>

              {/* Tidal */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 flex items-center space-x-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#00FFFF]" />
                  <span>Tidal URL</span>
                </label>
                <input
                  type="url"
                  value={tidalUrl}
                  onChange={(e) => setTidalUrl(e.target.value)}
                  placeholder="https://tidal.com/browse/track/..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-neutral-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              id="cancel-project-form-btn"
              className="px-5 py-2.5 border border-neutral-300 text-xs uppercase tracking-wider font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-project-btn"
              className="px-6 py-2.5 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#163a5f] transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Project to Portfolio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  initialProject,
}: ProjectFormModalProps) {
  if (!isOpen) return null;

  return (
    <ProjectFormModalContent
      key={initialProject?.id || 'new-project'}
      onClose={onClose}
      onSave={onSave}
      initialProject={initialProject}
    />
  );
}
