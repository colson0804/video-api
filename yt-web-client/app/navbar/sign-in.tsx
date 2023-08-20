"use client";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";
import styles from "./sign-in.module.css";

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  return (
    <div>
      <>
        {user ? (
          <button className={styles.signin} onClick={signOut}>
            Sign Out
          </button>
        ) : (
          <button className={styles.signin} onClick={signInWithGoogle}>
            Sign In
          </button>
        )}
      </>
    </div>
  );
}
