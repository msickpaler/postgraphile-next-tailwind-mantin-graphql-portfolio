import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { ReactElement } from "react";
import { Box, Group, MediaQuery } from "@mantine/core";
import { gql } from "@apollo/client";
import { Post, Query } from "@/types/graphql";
import Link from "next/link";
import { Carousel } from "@mantine/carousel";
import { SimplePostCard } from "@/components/Card/SimplePostCard";
import { serverSideApolloClient } from "@/contexts/MyApolloProvider";

const GET_NEW_POSTS_QUERY = gql`
  query getNewPosts {
    allPosts(first: 10, orderBy: CREATED_AT_DESC) {
      edges {
        node {
          id
          title
          createdAt
          userByAuthorId {
            name
          }
        }
      }
    }
  }
`;

type Props = {
  posts: Post[];
};

const Home: NextPageWithLayout<Props> = ({ posts }: Props) => {
  return (
    <>
      <Head>
        <title>gamelog</title>
        <meta
          name="description"
          content="これはゲームの記録を文字で共有するサービスです"
        />
      </Head>
      <Box mx="md">
        <Box>
          <h2>新規投稿</h2>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Carousel
              height={200}
              classNames={{
                controls: "hidden",
              }}
              slideSize="80%"
              slideGap="sm"
            >
              {posts.map((edge) => (
                <Carousel.Slide key={edge.id}>
                  <Link href={`/posts/${edge.id}`}>
                    <SimplePostCard
                      title={edge.title ?? ""}
                      authorName={edge.userByAuthorId?.name ?? ""}
                      createdAt={edge.createdAt ?? ""}
                      h={160}
                    />
                  </Link>
                </Carousel.Slide>
              ))}
            </Carousel>
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Group mx="auto">
              {posts.map((edge) => (
                <Link href={`/posts/${edge.id}`} key={edge.id}>
                  <SimplePostCard
                    title={edge.title ?? ""}
                    authorName={edge.userByAuthorId?.name ?? ""}
                    createdAt={edge.createdAt ?? ""}
                    w={260}
                    h={160}
                  />
                </Link>
              ))}
            </Group>
          </MediaQuery>
        </Box>
      </Box>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <GlobalHeader>{page}</GlobalHeader>;
};

export const getStaticProps = async () => {
  const { data } = await serverSideApolloClient.query<Pick<Query, "allPosts">>({
    query: GET_NEW_POSTS_QUERY,
    // next.jsのキャッシュを使うので、graphQLのキャッシュは無効化
    fetchPolicy: "no-cache",
  });

  if (!data.allPosts) {
    return {
      notFound: true,
    };
  }
  const posts = data.allPosts.edges
    .map((edge) => edge.node)
    .filter((node): node is NonNullable<typeof node> => !!node);

  return {
    props: {
      posts,
    },
    revalidate: 120, // seconds
  };
};

export default Home;
