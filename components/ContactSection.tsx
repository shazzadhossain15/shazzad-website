'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Youtube,
  Music,
  Send,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function ContactSection() {
  const { addContactSubmission, homeData } = usePortfolio();
  const { contact } = homeData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Film / Documentary Score (BGM)',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setIsLoading(true);

    // Save contact submission with timestamp and 'Unread' status into persistent context
    addContactSubmission({
      name: formData.name.trim(),
      email: formData.email.trim(),
      projectType: formData.projectType,
      message: formData.message.trim(),
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: 'Film / Documentary Score (BGM)',
        message: '',
      });
    }, 400);
  };

  return (
    <section
      id="contact"
      aria-label="Contact and Inquiries"
      className="w-full py-20 md:py-28 bg-white border-t border-neutral-200/80"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#0f2b48] mb-3">
            <span className="w-5 h-[1.5px] bg-[#0f2b48]"></span>
            <span>{contact.sectionSubtitle || 'Initiate a Conversation'}</span>
          </div>
          <h2
            id="contact-heading"
            className="font-serif-classic text-4xl sm:text-5xl font-normal text-neutral-950 tracking-tight"
          >
            {contact.sectionHeading || 'Connect & Collaborate'}
          </h2>
          <div className="w-12 h-[1.5px] bg-[#0f2b48] mt-4"></div>
          {contact.introText && (
            <p className="mt-4 text-sm text-neutral-600 max-w-xl">
              {contact.introText}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact & Social Links */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Channels */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Direct Channels
              </h3>

              {/* WhatsApp direct link */}
              {contact.whatsappNumber && (
                <a
                  href={contact.whatsappLink || `https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Shazzad,%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20music%20project.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-link"
                  className="group flex items-center justify-between p-4 border border-neutral-200 hover:border-[#0f2b48] transition-colors bg-neutral-50/40"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-none bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-500 font-medium">WhatsApp Message</span>
                      <span className="text-sm font-serif-classic text-neutral-900 group-hover:text-[#0f2b48]">
                        {contact.whatsappNumber}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#0f2b48]" />
                </a>
              )}

              {/* Email direct link */}
              {contact.emailAddress && (
                <a
                  href={`mailto:${contact.emailAddress}?subject=Music%20Portfolio%20Inquiry`}
                  id="contact-email-link"
                  className="group flex items-center justify-between p-4 border border-neutral-200 hover:border-[#0f2b48] transition-colors bg-neutral-50/40"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-none bg-neutral-100 text-[#0f2b48] flex items-center justify-center border border-neutral-200">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-500 font-medium">Official Studio Email</span>
                      <span className="text-sm font-serif-classic text-neutral-900 group-hover:text-[#0f2b48]">
                        {contact.emailAddress}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#0f2b48]" />
                </a>
              )}
            </div>

            {/* Social Media Links/Icons (Instagram, YouTube, etc.) */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                Streaming & Social Profiles
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {contact.instagramUrl && (
                  <a
                    href={contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2.5 p-3 border border-neutral-200 hover:border-[#0f2b48] text-xs text-neutral-700 hover:text-[#0f2b48] transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-neutral-600" />
                    <span>Instagram</span>
                  </a>
                )}

                {contact.youtubeUrl && (
                  <a
                    href={contact.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2.5 p-3 border border-neutral-200 hover:border-[#0f2b48] text-xs text-neutral-700 hover:text-[#0f2b48] transition-colors"
                  >
                    <Youtube className="w-4 h-4 text-neutral-600" />
                    <span>YouTube Official</span>
                  </a>
                )}

                {contact.spotifyUrl && (
                  <a
                    href={contact.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2.5 p-3 border border-neutral-200 hover:border-[#0f2b48] text-xs text-neutral-700 hover:text-[#0f2b48] transition-colors"
                  >
                    <Music className="w-4 h-4 text-neutral-600" />
                    <span>Spotify Artist</span>
                  </a>
                )}

                {contact.soundcloudUrl && (
                  <a
                    href={contact.soundcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2.5 p-3 border border-neutral-200 hover:border-[#0f2b48] text-xs text-neutral-700 hover:text-[#0f2b48] transition-colors"
                  >
                    <Music className="w-4 h-4 text-neutral-600" />
                    <span>SoundCloud</span>
                  </a>
                )}
              </div>
            </div>

            {/* Working note */}
            {contact.availabilityNote && (
              <div className="border-l-2 border-[#0f2b48] pl-4 py-1 text-xs text-neutral-500 leading-relaxed">
                {contact.availabilityNote}
              </div>
            )}
          </div>

          {/* Right Column: Simple Contact Form (Name, Email, Message) */}
          <div className="lg:col-span-7">
            <div className="border border-neutral-200 p-6 sm:p-8 bg-neutral-50/30">
              <h3 className="font-serif-classic text-2xl text-neutral-950 font-normal mb-2">
                {contact.formHeading || 'Send a Direct Inquiry'}
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                {contact.formDescription || 'Tell me about your film, project timeline, or musical vision.'}
              </p>

              {isSubmitted ? (
                <div className="p-6 bg-white border border-emerald-200 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif-classic text-xl text-neutral-900">
                    Message Sent Successfully
                  </h4>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you! Your message has been sent. I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wider text-neutral-700 hover:border-[#0f2b48]"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                    >
                      Your Name <span className="text-[#0f2b48]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Lin"
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-[#0f2b48] focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                    >
                      Email Address <span className="text-[#0f2b48]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@studio.com"
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-[#0f2b48] focus:outline-none"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-project-type"
                      className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                    >
                      Inquiry Category
                    </label>
                    <select
                      id="contact-project-type"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 focus:border-[#0f2b48] focus:outline-none"
                    >
                      <option value="Film / Documentary Score (BGM)">Film / Documentary Score (BGM)</option>
                      <option value="Vocal / Artist Collaboration">Vocal / Artist Collaboration</option>
                      <option value="Full Music Production & Arrangement">Full Music Production & Arrangement</option>
                      <option value="Audio Mixdown & Master">Audio Mixdown & Master</option>
                      <option value="General Conversation / Press">General Conversation / Press</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                    >
                      Message / Project Details <span className="text-[#0f2b48]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share reference music, rough timelines, and what sonic world you are aiming to create..."
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-[#0f2b48] focus:outline-none resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    id="contact-submit-btn"
                    className="w-full py-3 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#163a5f] transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span>Sending note...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
