import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from 'react';

// ----------------------
// User Type Definition
// ----------------------
interface User {
  id: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
}

// ----------------------
// Auth Context Type
// ----------------------
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// ----------------------
// Auth Context
// ----------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------
// Custom Hook
// ----------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ----------------------
// AuthProvider Component
// ----------------------
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user/token from sessionStorage on mount
  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log(storedUser);
      }
    } catch (err) {
      console.error("Error restoring session:", err);
      sessionStorage.clear();
    }
  }, []);

  // Login function
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export { useContext };

