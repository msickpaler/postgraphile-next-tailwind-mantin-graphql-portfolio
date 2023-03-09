import { FirebaseApp } from "firebase/app";
import { createContext, useContext } from "react";

export const AuthContext = createContext<FirebaseApp | undefined>(undefined);

export function useAuthContext() {
  return useContext(AuthContext);
}
