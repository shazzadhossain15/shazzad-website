export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    order: 1,
    question: 'What services do you offer?',
    answer:
      'I offer custom BGM/background score composition, original song production, mixing & mastering, and remixes — for films, video content, podcasts, advertisements, and personal projects.',
  },
  {
    id: 'faq-2',
    order: 2,
    question: 'How long does a project typically take?',
    answer:
      'Depending on the complexity of the project, it usually takes 3-7 business days. If you need urgent delivery, please let me know — an express option may be available.',
  },
  {
    id: 'faq-3',
    order: 3,
    question: 'How many revisions are included?',
    answer:
      'Each package typically includes 2-3 rounds of revisions. Additional revisions beyond that may incur extra charges.',
  },
  {
    id: 'faq-4',
    order: 4,
    question: 'What music licensing/usage rights do I get?',
    answer:
      'Upon full delivery, you will receive usage rights according to the agreed scope (personal/commercial use — depending on the package). For commercial projects, please inform me in advance.',
  },
  {
    id: 'faq-5',
    order: 5,
    question: 'What file formats will I receive?',
    answer:
      'Delivery is typically provided in both WAV and MP3 formats. Stems/individual tracks can also be provided upon request (subject to discussion).',
  },
  {
    id: 'faq-6',
    order: 6,
    question: 'How do payments work?',
    answer:
      'Typically, 50% is required upfront before starting the project, with the remaining 50% due upon delivery. For larger projects, milestone-based payments can also be arranged.',
  },
  {
    id: 'faq-7',
    order: 7,
    question: 'Can I request a specific style or reference track?',
    answer:
      'Yes, absolutely! Feel free to send a reference track or mood board, and I will try to match your vision as closely as possible.',
  },
  {
    id: 'faq-8',
    order: 8,
    question: 'Do you offer exclusive rights to the music?',
    answer:
      'Yes, exclusive rights are available for an additional fee. This ensures the track is used only by you and not resold to anyone else.',
  },
  {
    id: 'faq-9',
    order: 9,
    question: 'What information do you need to start a project?',
    answer:
      'Please share the project type, duration, mood/style reference, deadline, and budget, and I will send you a quote promptly.',
  },
  {
    id: 'faq-10',
    order: 10,
    question: 'How can I get in touch to discuss a project?',
    answer:
      'Fill out the Contact form or message me directly via WhatsApp/social media — I usually reply within 24 hours.',
  },
];
