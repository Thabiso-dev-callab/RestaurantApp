// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import * as Auth from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { AppUser, Card } from "../utils/types";

type RegisterInput = {
  email: string;
  password: string;

  name: string;
  surname: string;
  phone: string;
  address: string;

  card: Card;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;

  register: (input: RegisterInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as any);

function fallbackUser(fbUser: any): AppUser {
  const email = fbUser?.email ?? "";
  return {
    id: fbUser.uid,
    role: email.endsWith("@admin.com") ? "admin" : "user",
    email,
    name: "",
    surname: "",
    phone: "",
    address: "",
    card: { cardNumber: "", cardExpiry: "", cardCvv: "" },
  };
}

function mergeUser(fbUser: any, data?: Partial<AppUser> | null): AppUser {
  const email = fbUser?.email ?? data?.email ?? "";
  return {
    id: fbUser.uid, // ✅ ALWAYS uid (fixes orders query)
    role: (data?.role as any) ?? (email.endsWith("@admin.com") ? "admin" : "user"),
    email,

    name: data?.name ?? "",
    surname: data?.surname ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
    card: data?.card ?? { cardNumber: "", cardExpiry: "", cardCvv: "" },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = (Auth as any).onAuthStateChanged(auth, async (fbUser: any) => {
      try {
        if (!fbUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const net = await NetInfo.fetch();
        if (!net.isConnected) {
          setUser(fallbackUser(fbUser));
          setLoading(false);
          return;
        }

        const ref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as Partial<AppUser>;
          const merged = mergeUser(fbUser, data);

          // Keep Firestore consistent (optional but good)
          await setDoc(ref, merged, { merge: true });

          setUser(merged);
        } else {
          const created = fallbackUser(fbUser);
          await setDoc(ref, created);
          setUser(created);
        }

        setLoading(false);
      } catch {
        if (fbUser) setUser(fallbackUser(fbUser));
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const register = async (input: RegisterInput) => {
    const cred = await (Auth as any).createUserWithEmailAndPassword(auth, input.email, input.password);

    const newUser: AppUser = {
      id: cred.user.uid,
      role: input.email.endsWith("@admin.com") ? "admin" : "user",
      email: input.email,
      name: input.name,
      surname: input.surname,
      phone: input.phone,
      address: input.address,
      card: input.card,
    };

    await setDoc(doc(db, "users", newUser.id), newUser);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    await (Auth as any).signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await (Auth as any).signOut(auth);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    const uid = (auth as any)?.currentUser?.uid;
    if (!uid || !user) return;

    const merged: AppUser = { ...user, ...updates, id: uid };
    setUser(merged);

    const net = await NetInfo.fetch();
    if (!net.isConnected) return;

    // remove undefined (Firestore rejects undefined)
    const clean = JSON.parse(JSON.stringify(updates));
    await updateDoc(doc(db, "users", uid), clean);
  };

  const value = useMemo(
    () => ({ user, loading, register, login, logout, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
