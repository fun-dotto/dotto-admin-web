"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onIdTokenChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthCookie, removeAuthCookie } from "@/app/actions/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await setAuthCookie(token);

        const tokenResult = await user.getIdTokenResult();
        const admin = tokenResult.claims.admin === true;
        const developer = tokenResult.claims.developer === true;
        setIsAdmin(admin);
        if (!admin && !developer) {
          setAuthError("管理者または開発者権限がありません。");
          await firebaseSignOut(auth);
          setUser(null);
          await removeAuthCookie();
        } else {
          setAuthError(null);
          setUser(user);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        await removeAuthCookie();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    await removeAuthCookie();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, authError, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
