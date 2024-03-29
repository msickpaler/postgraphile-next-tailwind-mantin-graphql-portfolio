import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { initializeApp, getApp, getApps } from "firebase/app";
import { AuthContext } from "@/contexts/AuthContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { MyApolloProvider } from "@/contexts/MyApolloProvider";
import { ModalsProvider } from "@mantine/modals";
import { InfoModal } from "@/components/Modal/InfoModal";
import { Inter } from "next/font/google";
import Head from "next/head";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          colors: {
            transparent: ["transparent"],
          },
          components: {
            TextInput: {
              defaultProps: {
                size: "md",
              },
            },
            PasswordInput: {
              defaultProps: {
                size: "md",
              },
            },
            Textarea: {
              defaultProps: {
                size: "md",
              },
            },
          },
        }}
      >
        <ModalsProvider modals={{ info: InfoModal }}>
          <AuthContext.Provider value={firebaseApp}>
            <MyApolloProvider>
              <div className={`${inter.variable} font-sans`}>
                {getLayout(<Component {...pageProps} />)}
              </div>
            </MyApolloProvider>
          </AuthContext.Provider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
