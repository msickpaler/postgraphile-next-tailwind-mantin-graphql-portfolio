import { PostForm } from "@/components/Form/PostForm";
import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
import { useAuth } from "@/hooks/useAuth";
import { CreatePostInput } from "@/types/graphql";
import { gql, useMutation } from "@apollo/client";
import { Box, Button, Flex, Grid, Header, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { EditorHeader } from "../../../components/Header/EditorHeader";

const CREATE_POST_MUTATION = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
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

const PostCreate: NextPageWithLayout = () => {
  const router = useRouter();

  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const isValid =
    title.length > 0 &&
    title.length <= TITLE_MAX_LENGTH &&
    body.length > 0 &&
    body.length <= BODY_MAX_LENGTH;

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: async () => {
      router.replace("/");
    },
    onError: () => {
      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "作成エラー",
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
    setBody(e.target.value);
  };

  const onClickBack = () => {
    router.back();
  };

  const onClickSave = () => {
    if (!user) {
      return;
    }

    const input: CreatePostInput = {
      post: {
        title,
        body,
        updatedAt: "2021-08-01T00:00:00.000Z",
        authorId: user.uid,
      },
    };

    createPost({
      variables: {
        input,
      },
    });
  };

  return (
    <>
      <Head>
        <title>編集画面</title>
      </Head>
      <Flex direction="column">
        <EditorHeader
          onClickBack={onClickBack}
          onClickSave={onClickSave}
          disabled={!isValid}
        />
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

export default PostCreate;
