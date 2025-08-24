import { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  useLoginMutation,
  useRegisterMutation,
} from '../redux/api/features/auth/authApi';

export interface User {
  id: string;
  name: string;
  email: string;
}

const AUTH_STORAGE_KEY = 'legal-vision-auth-user';
const TOKEN_STORAGE_KEY = 'authToken';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // Initialize user from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await loginMutation({ email, password }).unwrap();
        const { token, user } = res;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setUser(user);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await registerMutation({ name, email, password }).unwrap();
        const { token, user } = res;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setUser(user);
      } catch (error) {
        console.error('Register error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.reload();
  }, []);

  // Function to handle forced logout (e.g., from 401 responses)
  const forceLogout = useCallback(() => {
    logout();
    // Optionally redirect to login page or reload
    window.location.reload();
  }, [logout]);

  return {
    user,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    forceLogout,
    isAuthenticated: !!user,
  };
};
