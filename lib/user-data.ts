export type UserAccountStatus = 'Active' | 'Suspended';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string; // ISO date
  status: UserAccountStatus;
  source?: string;      // "How did you find me?": Instagram, YouTube, Google Search, Referral, Other
  userType?: string;    // "What best describes you?": Just a Fan/Listener, Looking to hire for a project, Fellow Artist/Collaborator, Other
  location?: string;    // Country/Location text
}

export const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 'usr-admin',
    name: 'Shazzad Hossain',
    email: 'unishop72@gmail.com',
    role: 'Producer & Studio Owner',
    joinedAt: '2023-01-15T10:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-1',
    name: 'Elena Vance',
    email: 'elena.vance@filmsmith.com',
    role: 'Independent Film Director',
    joinedAt: '2024-02-10T14:30:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-2',
    name: 'Marcus Cole',
    email: 'marcus.vocals@gmail.com',
    role: 'Singer-Songwriter & Vocalist',
    joinedAt: '2023-11-04T09:15:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-3',
    name: 'Aarav Sen',
    email: 'aarav@pixelframestudio.io',
    role: 'Lead Sound Designer, Pixel & Frame',
    joinedAt: '2023-08-20T11:45:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-4',
    name: 'Sophia Martin',
    email: 'smartin@oceanicdocs.org',
    role: 'Documentary Producer',
    joinedAt: '2023-05-12T16:20:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-5',
    name: 'Sarah Jenkins',
    email: 'sarah.j@ambientfrequencies.com',
    role: 'Audio Engineer & Sound Enthusiast',
    joinedAt: '2024-06-18T18:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-6',
    name: 'David Vance',
    email: 'david.vance@soundstage.net',
    role: 'Mixing Assistant',
    joinedAt: '2024-08-01T12:00:00.000Z',
    status: 'Active',
  },
];
