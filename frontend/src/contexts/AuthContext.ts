// src/contexts/AuthContext.ts
import { createContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);
