import { serverSideApolloClient } from "@/contexts/MyApolloProvider";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { Query } from "@/types/graphql";
import { gql } from "@apollo/client";
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
}: {
  dataByMonthArr: { month: string; count: number }[];
}) => {
  const config = {
    data: dataByMonthArr,
    xField: "month",
    yField: "count",
    xAxis: {
      tickCount: 5,
    },
  };

  return <Line {...config} />;
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
