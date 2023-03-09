import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { initializeApp, getApp, getApps } from "firebase/app";
import { AuthContext } from "@/contexts/AuthContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { MyApolloProvider } from "@/contexts/MyApolloPrivider";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

const firebaseApp = ((config) => {
  const apps = getApps();
  if (!apps.length) {
    initializeApp(config);
  }
  return getApp();
})(firebaseConfig);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "dark",
      }}
    >
      <AuthContext.Provider value={firebaseApp}>
        <MyApolloProvider>
          <Component {...pageProps} />
        </MyApolloProvider>
      </AuthContext.Provider>
    </MantineProvider>
  );
}
