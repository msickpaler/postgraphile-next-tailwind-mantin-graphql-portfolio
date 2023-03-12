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
  uri: "http://localhost:3000/graphql",
});

export const MyApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  const { token, loadingUser, getUserOnce } = useAuth();
  const client = new ApolloClient({
    link: createLink(token, loadingUser, getUserOnce),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
