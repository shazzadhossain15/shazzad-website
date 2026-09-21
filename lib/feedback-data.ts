export type FeedbackStatus = 'Pending' | 'Approved' | 'Rejected';

export interface FeedbackItem {
  id: string;
  userName: string;
  userEmail?: string;
  userRole: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  status: FeedbackStatus;
  verified: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-1',
    userName: 'Elena Vance',
    userEmail: 'elena.vance@filmsmith.com',
    userRole: 'Independent Film Director',
    rating: 5,
    comment:
      'Shazzad created the score for my short film "The Quiet Threshold". His understanding of subtlety and emotional pacing elevated the narrative completely. The felt piano and cello themes still give me chills. Working with him was effortless.',
    date: 'February 2024',
    status: 'Approved',
    verified: true,
  },
  {
    id: 'fb-2',
    userName: 'Marcus Cole',
    userEmail: 'marcus.vocals@gmail.com',
    userRole: 'Singer-Songwriter & Vocalist',
    rating: 5,
    comment:
      'A true producer in every sense of the word. Shazzad has an immaculate ear for vocal space and analog tone. He helped transform an acoustic demo into a rich, timeless track without ever losing its original vulnerability.',
    date: 'November 2023',
    status: 'Approved',
    verified: true,
  },
  {
    id: 'fb-3',
    userName: 'Aarav Sen',
    userEmail: 'aarav@pixelframestudio.io',
    userRole: 'Lead Sound Designer, Pixel & Frame',
    rating: 5,
    comment:
      'Collaborating with Shazzad on game audio and atmospheric BGM cues was inspiring. His stems were pristine, perfectly mixed, and slotted directly into our game audio middleware with zero friction. Highly recommended.',
    date: 'August 2023',
    status: 'Approved',
    verified: true,
  },
  {
    id: 'fb-4',
    userName: 'Sophia Martin',
    userEmail: 'smartin@oceanicdocs.org',
    userRole: 'Documentary Producer',
    rating: 5,
    comment:
      'The orchestral arrangements Shazzad delivered for our marine documentary had the gravitas of a BBC Earth composition. His professionalism, communication, and swift turnaround time made all the difference on a tight post-production schedule.',
    date: 'May 2023',
    status: 'Approved',
    verified: true,
  },
];
