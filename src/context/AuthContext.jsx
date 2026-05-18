import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5001/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ngo_token'));
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, fetch current user
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (jwt) => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ fullName, email, password, role, organizationName, missionStatement }) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role, organizationName, missionStatement })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    // Save token and set state
    localStorage.setItem('ngo_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    localStorage.setItem('ngo_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ngo_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const res = await fetch(`${API_URL}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, register, login, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
