import { create } from 'zustand';

export interface AuthUser {
  name: string;
  email: string;
  role: 'recruiter' | 'candidate';
  title: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: async (email, password) => {
    // Simulate small API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    let user: AuthUser;
    let role: 'recruiter' | 'candidate';

    if (email.toLowerCase().includes('candidate')) {
      role = 'candidate';
      user = {
        name: 'Sarah Jenkins',
        email: email || 'candidate@hireai.com',
        role: 'candidate',
        title: 'Candidate User',
      };
    } else {
      role = 'recruiter';
      user = {
        name: 'John Doe',
        email: email || 'recruiter@hireai.com',
        role: 'recruiter',
        title: 'Recruiting Director',
      };
    }

    const token = `mock-${role}-token`;
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_role', role);
    set({ user, token, isLoading: false });
    return true;
  },
  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    set({ user: null, token: null });
    window.location.href = '/';
  },
  checkAuth: () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('auth_token');
        const role = localStorage.getItem('auth_role');
        const userStr = localStorage.getItem('auth_user');

        if (token && role && userStr) {
          const user = JSON.parse(userStr);
          set({ user, token, isLoading: false });
          return;
        }

        const pathname = window.location.pathname;
        if (pathname.startsWith('/candidate')) {
          const candidateUser: AuthUser = {
            name: 'Sarah Jenkins',
            email: 'candidate@hireai.com',
            role: 'candidate',
            title: 'Candidate User'
          };
          localStorage.setItem('auth_user', JSON.stringify(candidateUser));
          localStorage.setItem('auth_token', 'mock-candidate-token');
          localStorage.setItem('auth_role', 'candidate');
          set({ user: candidateUser, token: 'mock-candidate-token', isLoading: false });
          return;
        } else if (pathname.startsWith('/recruiter')) {
          const recruiterUser: AuthUser = {
            name: 'John Doe',
            email: 'recruiter@hireai.com',
            role: 'recruiter',
            title: 'Recruiting Director'
          };
          localStorage.setItem('auth_user', JSON.stringify(recruiterUser));
          localStorage.setItem('auth_token', 'mock-recruiter-token');
          localStorage.setItem('auth_role', 'recruiter');
          set({ user: recruiterUser, token: 'mock-recruiter-token', isLoading: false });
          return;
        }
      } catch (e) {
        console.error('Auth check error:', e);
      }
      set({ isLoading: false });
    }
  },
}));
