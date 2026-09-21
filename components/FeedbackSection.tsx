'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, User, CheckCircle2, Lock, Trash2 } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function FeedbackSection() {
  const { user, openAuthModal, feedbackList, addFeedback, deleteFeedback, isUserSuspended } = usePortfolio();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [role, setRole] = useState<string>('Listener');
  const [submittedNotice, setSubmittedNotice] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isSuspended = Boolean(user && isUserSuspended(user.email));

  // Only display Approved feedback on the public site
  const approvedFeedback = React.useMemo(() => {
    return feedbackList.filter((item) => item.status === 'Approved');
  }, [feedbackList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuspended) {
      setErrorNotice('Your account has been restricted from submitting feedback.');
      return;
    }
    if (!comment.trim()) {
      setErrorNotice('Please write a brief note or comment.');
      return;
    }

    const success = addFeedback(rating, comment, role);
    if (success) {
      setComment('');
      setSubmittedNotice(true);
      setErrorNotice(null);
      setTimeout(() => setSubmittedNotice(false), 7000);
    } else {
      setErrorNotice('Your account has been restricted from submitting feedback.');
    }
  };

  return (
    <section
      id="feedback"
      aria-label="Feedback and Testimonials"
      className="w-full py-20 md:py-28 bg-white border-t border-neutral-200/80"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#0f2b48] mb-3">
            <span className="w-5 h-[1.5px] bg-[#0f2b48]"></span>
            <span>Community & Collaborators</span>
          </div>
          <h2
            id="feedback-heading"
            className="font-serif-classic text-4xl sm:text-5xl font-normal text-neutral-950 tracking-tight"
          >
            Feedback & Impressions
          </h2>
          <div className="w-12 h-[1.5px] bg-[#0f2b48] mt-4"></div>
          <p className="mt-4 text-sm text-neutral-600 max-w-xl">
            Notes and reviews from filmmakers, collaborating artists, and listeners. Your feedback helps shape future compositions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form or Login Prompt */}
          <div className="lg:col-span-5">
            {user ? (
              <div className="border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h3 className="font-serif-classic text-xl text-neutral-900 font-medium">
                      Leave Your Feedback
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Posting as <strong className="text-neutral-800">{user.name}</strong>
                    </p>
                  </div>
                  {isSuspended ? (
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                      Suspended
                    </span>
                  ) : (
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[#0f2b48]/10 text-[#0f2b48] font-medium">
                      Verified User
                    </span>
                  )}
                </div>

                {isSuspended && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                    <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-semibold block text-rose-900">Account Restricted</span>
                      <span className="text-rose-700 leading-relaxed">
                        Your account has been restricted from submitting feedback. You may continue to browse all music and content normally.
                      </span>
                    </div>
                  </div>
                )}

                {submittedNotice && (
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-semibold block text-neutral-900">Submission Received</span>
                      <span className="text-neutral-700 leading-relaxed">
                        Thank you! Your feedback has been submitted and will appear once reviewed.
                      </span>
                    </div>
                  </div>
                )}

                {errorNotice && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorNotice}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                      Rating (Optional)
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-neutral-300 hover:text-amber-500 transition-colors focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              (hoverRating || rating) >= star
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-neutral-500 pl-2">
                        {rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  {/* Role selector */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="feedback-role"
                      className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                    >
                      Your Role / Connection
                    </label>
                    <select
                      id="feedback-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-800 focus:border-[#0f2b48] focus:outline-none"
                    >
                      <option value="Film Director / Producer">Film Director / Producer</option>
                      <option value="Recording Artist / Vocalist">Recording Artist / Vocalist</option>
                      <option value="Sound Designer / Game Audio">Sound Designer / Game Audio</option>
                      <option value="Fellow Music Producer">Fellow Music Producer</option>
                      <option value="Listener & Fan">Listener & Fan</option>
                      <option value="Agency / Client">Agency / Client</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="feedback-comment"
                      className="block text-xs uppercase tracking-wider text-neutral-700 font-medium"
                    >
                      Your Note / Review
                    </label>
                    <textarea
                      id="feedback-comment"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience listening to Shazzad's scores, or collaborating on a track..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-400 focus:border-[#0f2b48] focus:outline-none resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-feedback-btn"
                    className="w-full py-3 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#163a5f] transition-colors"
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            ) : (
              /* Users who are not logged in see a "Login to leave feedback" prompt instead of the form */
              <div
                id="feedback-login-prompt"
                className="border border-neutral-200 bg-neutral-50/50 p-8 text-center space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0f2b48]/10 flex items-center justify-center text-[#0f2b48]">
                  <Lock className="w-5 h-5" />
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="font-serif-classic text-2xl text-neutral-900 font-normal">
                    Login to Leave Feedback
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Have you collaborated with Shazzad or listened to his scores? Sign in with email or guest credentials to post your review.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={openAuthModal}
                    id="prompt-login-btn"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0f2b48] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#163a5f] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In to Leave Feedback</span>
                  </button>
                </div>

                <p className="text-[11px] text-neutral-400">
                  Authentication is solely used to verify genuine community reflections.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Feedback List / Testimonials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span
                suppressHydrationWarning
                className="text-xs uppercase tracking-widest font-semibold text-neutral-900"
              >
                Reflections & Testimonials ({approvedFeedback.length})
              </span>
              <span className="text-xs text-neutral-500">Approved & Curated</span>
            </div>

            {approvedFeedback.length === 0 ? (
              <div className="border border-neutral-200 p-8 bg-neutral-50/50 text-center space-y-2">
                <p className="font-serif-classic text-lg text-neutral-800">
                  No public reflections yet
                </p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Be the first collaborator or listener to leave your note. Submitted feedback will appear here once reviewed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedFeedback.map((item) => (
                  <div
                    key={item.id}
                    id={`feedback-card-${item.id}`}
                    className="border border-neutral-200 p-6 bg-white space-y-3 hover:border-neutral-300 transition-colors"
                  >
                    {/* Rating Stars & Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-[11px] text-neutral-400">{item.date}</span>
                        {user && (user.name === item.userName || user.email === item.userEmail) && (
                          <button
                            onClick={() => deleteFeedback(item.id)}
                            title="Delete my feedback"
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Comment Quote */}
                    <p className="font-serif-classic text-base text-neutral-800 leading-relaxed italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>

                    {/* Author Name & Role */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                      <div>
                        <span className="font-medium text-neutral-900">{item.userName}</span>
                        <span className="text-neutral-400 mx-1.5">—</span>
                        <span className="text-neutral-500">{item.userRole}</span>
                      </div>

                      {item.verified && (
                        <span className="text-[10px] text-[#0f2b48] font-medium tracking-wide flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-[#0f2b48]" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
