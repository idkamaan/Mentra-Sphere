export type Step = 'landing' | 'intake' | 'loading' | 'dashboard' | 'payment';

export interface UserProfile {
  name: string;
  email: string;
  location: string;
}

export interface IntakeData {
  feelings: string;
  hobby: string;
  aiCategories?: string[]; // New field for LLM-based categorization
}

export interface Peer {
  id: number;
  name: string;
  category: string;
  hobby: string;
  avatar: string;
}

export interface MatchResult {
  groupName: string;
  peers: Peer[];
  icebreaker: string;
  userCategories: string[];
}

// Augment window for external libs
declare global {
  interface Window {
    jspdf: any;
    confetti: any;
  }
}