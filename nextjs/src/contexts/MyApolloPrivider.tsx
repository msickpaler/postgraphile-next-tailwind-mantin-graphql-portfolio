import { useAuth } from "@/hooks/useAuth";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const createLink = (token: string | null) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  return authLink.concat(httpLink);
};

export const MyApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuth();
  const client = new ApolloClient({
    link: createLink(token),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
