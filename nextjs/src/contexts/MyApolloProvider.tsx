import { useAuth } from "@/hooks/useAuth";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { User } from "firebase/auth";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

const createLink = (
  token: string | null,
  loadingUser: boolean,
  getUserOnce: () => Promise<User | null>
) => {
  const authLink = setContext(async (_, { headers }) => {
    const authorization =
      headers?.authorization ||
      (token
        ? `Bearer ${token}`
        : loadingUser
        ? `Bearer ${await (await getUserOnce())?.getIdToken()}`
        : "");
    return {
      headers: {
        ...headers,
        authorization,
      },
    };
  });
  return authLink.concat(httpLink);
};

// 本来別ファイルで定義するべきだが、デモみたいなもんなので適当にここに書く
export const serverSideApolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  ssrMode: typeof window === "undefined",
});

export const MyApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, loadingUser, getUserOnce } = useAuth();
  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createLink(token, loadingUser, getUserOnce),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
