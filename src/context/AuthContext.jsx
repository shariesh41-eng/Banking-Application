import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockBankingData';
import { storageService } from '../services/storageService';

const AuthContext = createContext();

const AUTH_USER_KEY = 'novabank_current_user';
const AUTH_TOKEN_KEY = 'novabank_session_token';

/**
 * CLEARLY DOCUMENTED DEMO CREDENTIALS FOR ALL ROLES
 *
 * NOTE: These are strictly mock frontend credentials for design and demonstration
 * purposes. In production, authentication and credential verification must be
 * executed by an isolated, audited backend API.
 */
export const DEMO_CREDENTIALS = [
  {
    role: 'customer',
    roleLabel: 'Customer (Private Wealth)',
    name: 'Alexandra Morgan',
    email: 'customer@novabank.com',
    password: 'Customer@123',
    title: 'Private Wealth Client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    defaultRoute: '/customer/dashboard',
    description: 'Access checking, high-yield reserves, wire transfers, and cards.',
  },
  {
    role: 'employee',
    roleLabel: 'Bank Employee (Relationship Officer)',
    name: 'David Chen',
    email: 'employee@novabank.com',
    password: 'Employee@123',
    title: 'Senior Relationship Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    defaultRoute: '/employee/dashboard',
    description: 'Underwrite commercial loans, review customer KYC queues, and manage client tickets.',
  },
  {
    role: 'admin',
    roleLabel: 'Super Admin (Platform Root)',
    name: 'Elena Rostova',
    email: 'admin@novabank.com',
    password: 'Admin@123',
    title: 'VP Platform Architecture & Security',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    defaultRoute: '/admin/dashboard',
    description: 'Monitor live API health, manage security policies, and inspect immutable audit logs.',
  },
];

export function AuthProvider({ children }) {
  // Current authenticated user (persisted in localStorage)
  const [user, setUser] = useState(() => {
    return storageService.get(AUTH_USER_KEY, null);
  });

  const [sessionToken, setSessionToken] = useState(() => {
    return storageService.get(AUTH_TOKEN_KEY, null);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user && sessionToken));
  const [loading, setLoading] = useState(false);

  // In-flight registration & password reset flow data
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [pendingResetEmail, setPendingResetEmail] = useState('');
  const [pendingOtpTarget, setPendingOtpTarget] = useState({ type: 'registration', destination: '' });

  // Centralized logout confirmation modal state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (user && sessionToken) {
      storageService.set(AUTH_USER_KEY, user);
      storageService.set(AUTH_TOKEN_KEY, sessionToken);
      setIsAuthenticated(true);
    } else {
      storageService.remove(AUTH_USER_KEY);
      storageService.remove(AUTH_TOKEN_KEY);
      setIsAuthenticated(false);
    }
  }, [user, sessionToken]);

  /**
   * Login with email and password or demo role
   */
  const login = async (roleOrEmail = 'customer', password = '', rememberMe = true) => {
    setLoading(true);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);

        // Find user by role or email
        let matchedUser = DEMO_CREDENTIALS.find(
          (c) => c.role === roleOrEmail || c.email.toLowerCase() === String(roleOrEmail).toLowerCase().trim()
        );

        // Fallback to mock users if not found in demo credentials
        if (!matchedUser) {
          const mockMatch = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === String(roleOrEmail).toLowerCase().trim() || u.role === roleOrEmail
          );
          if (mockMatch) {
            matchedUser = {
              ...mockMatch,
              defaultRoute: `/${mockMatch.role}/dashboard`,
            };
          }
        }

        if (!matchedUser) {
          reject(new Error('Invalid email or passkey. Please check credentials or use 1-click demo access.'));
          return;
        }

        // Demo password check: allow Demo password or if matchedUser default
        if (password && password !== matchedUser.password && password !== 'demo123' && password !== 'Test@1234') {
          // If using custom credentials, accept if password is provided
        }

        const authenticatedUser = {
          id: matchedUser.id || `usr_${matchedUser.role}_${Date.now()}`,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: matchedUser.avatar,
          title: matchedUser.title,
          phone: matchedUser.phone || '+1 (555) 234-5678',
          membershipTier: matchedUser.membershipTier || 'Platinum Elite',
          kycStatus: 'Verified',
          twoFactorEnabled: true,
          lastLogin: new Date().toISOString(),
          rememberMe,
        };

        const token = `jwt_novabank_sec_${matchedUser.role}_${Date.now().toString(36)}`;

        setUser(authenticatedUser);
        setSessionToken(token);
        setIsAuthenticated(true);

        resolve({ user: authenticatedUser, token, defaultRoute: matchedUser.defaultRoute });
      }, 450);
    });
  };

  /**
   * Switch actively logged in profile between customer, admin, or employee
   */
  const switchRole = (targetRole) => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === targetRole) || DEMO_CREDENTIALS[0];
    const updatedUser = {
      id: `usr_${cred.role}_demo`,
      name: cred.name,
      email: cred.email,
      role: cred.role,
      avatar: cred.avatar,
      title: cred.title,
      phone: '+1 (555) 234-5678',
      membershipTier: 'Platinum Elite',
      kycStatus: 'Verified',
      twoFactorEnabled: true,
      lastLogin: new Date().toISOString(),
    };

    const token = `jwt_novabank_sec_${cred.role}_${Date.now().toString(36)}`;
    setUser(updatedUser);
    setSessionToken(token);
    setIsAuthenticated(true);
    return updatedUser;
  };

  /**
   * Step 1 of customer registration: Stores pending details and initiates OTP
   */
  const startRegistration = (registrationData) => {
    setPendingRegistration(registrationData);
    setPendingOtpTarget({
      type: 'registration',
      destination: registrationData.phone || registrationData.email,
    });
    return true;
  };

  /**
   * Step 2 of registration / password reset: Verifies demo OTP code
   * Master test code is '123456', but any 6-digit number is accepted for demo convenience
   */
  const verifyOtp = (code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
          reject(new Error('Please enter a valid 6-digit verification code.'));
          return;
        }

        // Demo logic: accept 123456 or any 6 numeric digits in demo mode
        resolve({ success: true, verifiedAt: new Date().toISOString() });
      }, 500);
    });
  };

  /**
   * Step 3: Completes customer profile setup and provisions account
   */
  const completeProfileSetup = (profileDetails = {}) => {
    const newUser = {
      id: `usr_cust_${Date.now()}`,
      name: pendingRegistration
        ? `${pendingRegistration.firstName} ${pendingRegistration.lastName}`
        : 'New Customer',
      email: pendingRegistration?.email || 'new.client@novabank.com',
      role: 'customer',
      avatar: profileDetails.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      title: 'Private Wealth Client',
      phone: pendingRegistration?.phone || '+1 (555) 123-4567',
      membershipTier: 'Platinum Elite',
      kycStatus: 'Verified',
      twoFactorEnabled: true,
      transactionPinSet: Boolean(profileDetails.pin),
      accountType: pendingRegistration?.accountType || 'checking',
      lastLogin: new Date().toISOString(),
    };

    const token = `jwt_novabank_cust_${Date.now().toString(36)}`;

    setUser(newUser);
    setSessionToken(token);
    setIsAuthenticated(true);
    setPendingRegistration(null);

    return newUser;
  };

  /**
   * Password reset flow
   */
  const initiateForgotPassword = (identifier) => {
    setPendingResetEmail(identifier);
    setPendingOtpTarget({
      type: 'password_reset',
      destination: identifier,
    });
    return true;
  };

  const completePasswordReset = (_newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPendingResetEmail('');
        resolve({ success: true });
      }, 400);
    });
  };

  /**
   * Terminates active session and clears storage
   */
  const logout = () => {
    setUser(null);
    setSessionToken(null);
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    storageService.remove(AUTH_USER_KEY);
    storageService.remove(AUTH_TOKEN_KEY);
  };

  const userRole = user?.role || 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
        sessionToken,
        loading,
        demoCredentials: DEMO_CREDENTIALS,
        pendingRegistration,
        pendingResetEmail,
        pendingOtpTarget,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        login,
        logout,
        switchRole,
        startRegistration,
        verifyOtp,
        completeProfileSetup,
        initiateForgotPassword,
        completePasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
