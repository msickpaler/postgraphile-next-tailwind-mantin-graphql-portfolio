import { useFirebaseContext } from "@/contexts/AuthContext";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export const useAuth = () => {
  const firebaseApp = useFirebaseContext();
  const auth = getAuth(firebaseApp);

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
    subscribeCurrentUser,
    getCurrentUser,
    signUp,
    signIn,
  };
};
