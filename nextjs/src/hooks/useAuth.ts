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
  const [user, setUser] = useState<User | null>(null);

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          setToken(token);
        });
      } else {
        setToken(null);
      }
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoadingUser(false);
    });
    return unsubscribe;
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return {
    token,
    user,
    loadingUser,
    signUp,
    signIn,
    signOut,
  };
};
