import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
import { serverSideApolloClient } from "@/contexts/MyApolloProvider";
import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { checkSafeInteger } from "@/lib/check-safe-integer";
import { formatToJP } from "@/lib/format-to-jp";
import { Post, Query } from "@/types/graphql";
import { gql, useMutation } from "@apollo/client";
import { Avatar, Box, Button, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const GET_POST_BY_ID_QUERY = gql`
  query getPostById($id: Int!) {
    postById(id: $id) {
      id
      title
      body
      createdAt
      updatedAt
      authorId
      userByAuthorId {
        name
      }
    }
  }
`;

const GET_ALL_POSTS_QUERY = gql`
  query getAllPosts {
    allPosts {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePostById($input: DeletePostByIdInput!) {
    deletePostById(input: $input) {
      deletedPostId
    }
  }
`;

const PostPage = ({ post, authorName }: { post: Post; authorName: string }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [deletePostById] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: async () => {
      try {
        router.replace("/");
      } catch (e) {
        modals.openContextModal({
          ...infoModalDefaultArgs,
          title: "削除エラー",
          innerProps: {
            description: "不明のエラーが発生しました",
          },
        });
      }
    },
    onError: (e) => {
      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "削除エラー",
        innerProps: {
          description: "不明のエラーが発生しました",
        },
      });
    },
  });

  const deletePost = () => {
    deletePostById({
      variables: {
        input: {
          id: post.id,
        },
      },
    });
  };

  const onClickDelete = () => {
    modals.openConfirmModal({
      title: "投稿の削除",
      children: (
        <>
          <Text size="sm">以下の投稿を削除します。よろしいですか？</Text>
          <Text size="sm" fw="bold" my="xs">
            {post.title}
          </Text>
        </>
      ),
      centered: true,
      labels: { confirm: "削除", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: deletePost,
    });
  };

  if (!post) {
    return null;
  }

  return (
    <>
      <Head>
        <title>gamelog</title>
        <meta name="description" content={post.body.slice(0, 100)} />
      </Head>
      <Box mx="md">
        <article className="max-w-3xl mt-24 mx-auto">
          <h1 className="break-all mb-2">{post.title}</h1>
          <Group align="center" noWrap>
            <Avatar
              // transparentにしている分、余分な空白があるため、マイナスマージンを使用して調整
              mr={-10}
              variant="filled"
              color="transparent"
            />
            <Stack spacing={0}>
              <Text size="sm" className="break-all" lineClamp={1}>
                {authorName}
              </Text>
              <Text size="sm" className="break-all">
                {formatToJP(post.createdAt, true)}
              </Text>
            </Stack>
            {user?.uid && post?.authorId && user?.uid === post.authorId && (
              <>
                <Button component={Link} href={`/posts/${post.id}/edit`}>
                  編集
                </Button>
                <Button color="red" onClick={onClickDelete}>
                  削除
                </Button>
              </>
            )}
          </Group>

          <Text className="break-all mt-12 whitespace-pre-wrap">
            {post.body}
          </Text>
        </article>
      </Box>
    </>
  );
};

PostPage.getLayout = function getLayout(page: ReactElement) {
  return <GlobalHeader>{page}</GlobalHeader>;
};

export const getStaticProps = async ({
  params: { pid },
}: {
  params: { pid: string };
}) => {
  const id = parseInt(pid);
  if (!checkSafeInteger(id)) {
    return {
      notFound: true,
    };
  }

  const { data } = await serverSideApolloClient.query<Pick<Query, "postById">>({
    query: GET_POST_BY_ID_QUERY,
    variables: {
      id,
    },
    // next.jsのキャッシュを使うので、graphQLのキャッシュは無効化
    fetchPolicy: "no-cache",
  });

  if (!data.postById) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post: data.postById,
      authorName: data.postById.userByAuthorId?.name ?? "",
    },
    revalidate: 60, // seconds
  };
};

export const getStaticPaths = async () => {
  const { data } = await serverSideApolloClient.query<Pick<Query, "allPosts">>({
    query: GET_ALL_POSTS_QUERY,
    // next.jsのキャッシュを使うので、graphQLのキャッシュは無効化
    fetchPolicy: "no-cache",
  });
  const ids = data?.allPosts?.edges.map((edge) => edge.node?.id) ?? [];
  return {
    paths: ids
      .filter((id): id is number => id !== undefined)
      .map((id) => ({ params: { pid: id.toString() } })),
    fallback: true,
  };
};

export default PostPage;
