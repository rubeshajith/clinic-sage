import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { User } from "../types";

// Map Firebase user to our User type
const mapUser = (
  firebaseUser: import("firebase/auth").User | null,
): User | null => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? firebaseUser.email ?? "Doctor",
  };
};

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(result.user)!;
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  getCurrentUser(): User | null {
    return mapUser(auth.currentUser);
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      callback(mapUser(firebaseUser));
    });
  },
};
