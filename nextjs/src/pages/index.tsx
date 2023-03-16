import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { ReactElement } from "react";
import { Box, Group, MediaQuery } from "@mantine/core";
import { gql, useQuery } from "@apollo/client";
import { Query, QueryAllPostsArgs } from "@/types/graphql";
import Link from "next/link";
import { Carousel } from "@mantine/carousel";
import { SimplePostCard } from "@/components/Card/SimplePostCard";

const GET_NEW_POSTS_QUERY = gql`
  query getUserById {
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

const Home: NextPageWithLayout = () => {
  const { data } = useQuery<Pick<Query, "allPosts">, QueryAllPostsArgs>(
    GET_NEW_POSTS_QUERY
  );

  return (
    <>
      <Head>
        <title>gamelog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
              {data?.allPosts?.edges.map((edge) => (
                <Carousel.Slide key={edge?.node?.id}>
                  <Link href={`/posts/${edge?.node?.id}`}>
                    <SimplePostCard
                      title={edge?.node?.title ?? ""}
                      authorName={edge?.node?.userByAuthorId?.name ?? ""}
                      createdAt={edge?.node?.createdAt ?? ""}
                      h={160}
                    />
                  </Link>
                </Carousel.Slide>
              ))}
            </Carousel>
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Group mx="auto">
              {data?.allPosts?.edges.map((edge) => (
                <Link href={`/posts/${edge?.node?.id}`} key={edge?.node?.id}>
                  <SimplePostCard
                    title={edge?.node?.title ?? ""}
                    authorName={edge?.node?.userByAuthorId?.name ?? ""}
                    createdAt={edge?.node?.createdAt ?? ""}
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

export default Home;
