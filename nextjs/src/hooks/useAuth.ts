import { useAuthContext } from "@/contexts/AuthContext";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  onIdTokenChanged,
} from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const firebaseApp = useAuthContext();
  const auth = getAuth(firebaseApp);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    onIdTokenChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          setToken(token);
        });
      } else {
        setToken(null);
      }
    });
  }, [auth]);

  const subscribeCurrentUser = (callback: (user: User | null) => void) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      callback(user);
    });
    return unsubscribe;
  };

  const getCurrentUser = () => {
    return auth.currentUser;
  };

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  return {
    token,
    subscribeCurrentUser,
    getCurrentUser,
    signUp,
    signIn,
  };
};
