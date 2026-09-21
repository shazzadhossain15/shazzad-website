export type ContactSubmissionStatus = 'Unread' | 'Read';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string; // ISO string
  status: ContactSubmissionStatus;
}

export const INITIAL_CONTACT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'contact-msg-1',
    name: 'Claire Dupont',
    email: 'c.dupont@lumierefilms.fr',
    projectType: 'Film / Documentary Score (BGM)',
    message:
      'Hello Shazzad, I came across your composition for "The Quiet Threshold" and was deeply moved by the delicate cello and piano textures. We are in post-production for a 45-minute environmental documentary exploring ancient boreal forests. We are looking for an original, contemplative acoustic score with subtle ambient synth beds. We have a rough assembly ready for spotting. Looking forward to discussing your availability and turnaround!',
    createdAt: '2026-09-19T05:40:00.000Z',
    status: 'Unread',
  },
  {
    id: 'contact-msg-2',
    name: 'Julian Vance',
    email: 'julian.v@astralforgegames.com',
    projectType: 'Full Music Production & Arrangement',
    message:
      'Hi Shazzad, our studio is producing an atmospheric narrative mystery game. We require 4 interactive exploration themes that can transition seamlessly between tension and tranquility, alongside a poignant main menu theme. We love your hybrid approach of live recorded instruments and analog hardware synthesis. Could you share your commercial sync rates and stem delivery structure?',
    createdAt: '2026-09-18T18:15:00.000Z',
    status: 'Unread',
  },
  {
    id: 'contact-msg-3',
    name: 'Amara Thorne',
    email: 'amara.thorne.music@gmail.com',
    projectType: 'Vocal / Artist Collaboration',
    message:
      'Dear Shazzad, I am an indie-folk singer-songwriter preparing a 5-track EP. I have acoustic guitar and vocal scratch tracks recorded at 48kHz/24-bit. I need your production touch to arrange chamber strings, warm percussion, and handle the final mixdown. Your work has a wonderful organic breathing room that I want for these songs.',
    createdAt: '2026-09-16T11:20:00.000Z',
    status: 'Read',
  },
];
