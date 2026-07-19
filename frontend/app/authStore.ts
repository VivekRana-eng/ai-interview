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
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (email === 'recruiter@hireai.com' && password === 'recruiter') {
      const user: AuthUser = {
        name: 'John Doe',
        email,
        role: 'recruiter',
        title: 'Recruiting Director',
      };
      const token = 'mock-recruiter-token';
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_role', 'recruiter');
      set({ user, token, isLoading: false });
      return true;
    }

    if (email === 'candidate@hireai.com' && password === 'candidate') {
      const user: AuthUser = {
        name: 'Sarah Jenkins',
        email,
        role: 'candidate',
        title: 'Candidate User',
      };
      const token = 'mock-candidate-token';
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_role', 'candidate');
      set({ user, token, isLoading: false });
      return true;
    }

    throw new Error('Invalid email or password');
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
          if (user && user.role === 'candidate' && user.name === 'Jane Doe') {
            user.name = 'Sarah Jenkins';
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
          set({ user, token, isLoading: false });
          return;
        }
      } catch (e) {
        console.error('Auth check error:', e);
      }
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
