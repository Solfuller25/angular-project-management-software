import { Profile } from "./user.model";

export interface Announcement {
    id?: number;
    date: Date;
    title: string;
    message: string;
    company: number;
    author: Author;
    minimized?: boolean; 
    animateOut?: boolean;
};

interface Author {
    id: number;
    profile: Profile;
  }

export const defaultAnnouncement: Announcement = {
    date: new Date(),
    title: "",
    message: "",
    company: 0,
    author: { 'id': 0, 'profile': {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
    },
};