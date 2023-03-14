import { PostForm } from "@/components/Form/PostForm";
import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
import { serverSideApolloClient } from "@/contexts/MyApolloPrivider";
import { useAuth } from "@/hooks/useAuth";
import { checkSafeInteger } from "@/lib/check-safe-integer";
import { UpdatePostByIdInput, Post, Query } from "@/types/graphql";
import { gql, useMutation } from "@apollo/client";
import { Box, Button, Flex, Grid, Header, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { NextPageWithLayout } from "../../_app";

const GET_POST_BY_ID_QUERY = gql`
  query getPostById($id: Int!) {
    postById(id: $id) {
      id
      title
      body
      authorId
    }
  }
`;

const UPDATE_POST_MUTATION = gql`
  mutation updatePost($input: UpdatePostByIdInput!) {
    updatePostById(input: $input) {
      post {
        id
        title
      }
    }
  }
`;

const TITLE_MAX_LENGTH = 255;
// 65535はTEXT型の最大長
const BODY_MAX_LENGTH = 65535;

type Props = {
  post: Post;
};

const PostEdit: NextPageWithLayout<Props> = ({ post }: Props) => {
  const router = useRouter();

  const { user } = useAuth();

  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const isValid =
    title.length > 0 &&
    title.length <= TITLE_MAX_LENGTH &&
    body.length > 0 &&
    body.length <= BODY_MAX_LENGTH;

  const [updatePost] = useMutation(UPDATE_POST_MUTATION, {
    onCompleted: async () => {
      router.replace("/");
    },
    onError: () => {
      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "登録エラー",
        innerProps: {
          description: "不明のエラーが発生しました",
        },
      });
    },
  });

  const handleChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tmp = e.target.value;
    if (tmp.includes("\r") || tmp.includes("\n")) {
      // remove new line
      setTitle(tmp.replace(/(\r|\n)/g, ""));
    } else {
      setTitle(tmp);
    }
  };

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const onClickBack = () => {
    router.back();
  };

  const onClickSave = () => {
    if (!user) {
      return;
    }

    const input: UpdatePostByIdInput = {
      id: post.id,
      postPatch: {
        title,
        body,
      },
    };

    updatePost({
      variables: {
        input,
      },
    });
  };

  if (!post?.authorId || !user?.uid || post?.authorId !== user?.uid) {
    return null;
  }

  return (
    <>
      <Head>
        <title>編集画面</title>
      </Head>
      <Flex direction="column">
        <Header
          height="auto"
          p="xs"
          className="sticky flex items-center justify-end border-solid border-0 border-b border-neutral-700 backdrop-blur-md z-50"
          top={0}
        >
          <Button fz="xl" mr="auto" color="transparent" onClick={onClickBack}>
            ←
          </Button>
          <Button onClick={onClickSave} disabled={!isValid}>
            保存
          </Button>
        </Header>
        <Grid m={0} px="xs" pt="xl">
          <Grid.Col sm={3} className="hidden sm:block" />
          <Grid.Col sm={6} p={0} className="flex flex-col gap-2">
            <PostForm
              title={title}
              body={body}
              handleChangeTitle={handleChangeTitle}
              handleChangeBody={handleChangeBody}
            />
          </Grid.Col>
          <Grid.Col sm={3} className="hidden sm:block" />
        </Grid>
      </Flex>
    </>
  );
};

export const getServerSideProps = async ({
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
    // 最新の情報がほしいのでキャッシュを使わない
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
    },
  };
};

export default PostEdit;
