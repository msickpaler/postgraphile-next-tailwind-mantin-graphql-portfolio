import { FirebaseApp } from "firebase/app";
import { createContext, useContext } from "react";

export const FirebaseContext = createContext<FirebaseApp | undefined>(
  undefined
);

export function useFirebaseContext() {
  return useContext(FirebaseContext);
}
