import { serverSideApolloClient } from "@/contexts/MyApolloProvider";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { Query } from "@/types/graphql";
import { gql } from "@apollo/client";
import { Text, Center, Stack } from "@mantine/core";
import dynamic from "next/dynamic";
import { ReactElement, useEffect, useState } from "react";

const Line = dynamic(
  () => import("@ant-design/plots").then(({ Line }) => Line),
  { ssr: false }
);

const GET_NEW_POSTS_QUERY = gql`
  query getAllPosts {
    allPosts {
      edges {
        node {
          createdAt
        }
      }
      totalCount
    }
  }
`;

const DataPage = ({
  dataByMonthArr,
  totalCount,
}: {
  dataByMonthArr: { month: string; count: number }[];
  totalCount: number;
}) => {
  const config = {
    data: dataByMonthArr,
    xField: "month",
    yField: "count",
    xAxis: {
      title: {
        text: "投稿日",
      },
    },
    yAxis: {
      title: {
        text: "投稿数",
      },
      tickCount: 5,
    },
  };

  return (
    <main>
      <Center>
        <h1>データ</h1>
      </Center>
      <Stack align="center" spacing={0} mb="xl">
        <h2>総投稿数</h2>
        <Text
          sx={(theme) => ({
            background: theme.fn.gradient(),
          })}
          className="bg-clip-text text-transparent text-3xl"
        >
          {totalCount.toLocaleString()}
        </Text>
      </Stack>

      <Center>
        <h3>月別投稿数</h3>
      </Center>
      <Line {...config} className="px-12" />
    </main>
  );
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

  const postData = data.allPosts.edges
    .map((edge) =>
      edge.node
        ? {
            createdAt: edge.node?.createdAt,
          }
        : null
    )
    .filter((node): node is NonNullable<typeof node> => !!node);

  const dataByMonth = postData.reduce((acc, cur) => {
    const month = cur.createdAt?.slice(0, 7);
    if (month) {
      if (acc[month]) {
        acc[month] += 1;
      } else {
        acc[month] = 1;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  const dataByMonthArr = Object.entries(dataByMonth).map(([month, count]) => ({
    month,
    count,
  }));

  return {
    props: {
      dataByMonthArr,
      totalCount: data.allPosts.totalCount,
    },
    revalidate: 120, // seconds
  };
};

DataPage.getLayout = function getLayout(page: ReactElement) {
  return <GlobalHeader>{page}</GlobalHeader>;
};

export default DataPage;
