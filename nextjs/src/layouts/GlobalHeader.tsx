import { useAuth } from "@/hooks/useAuth";
import {
  Mutation,
  Query,
  QueryUserByIdArgs,
  UpdateUserByIdInput,
} from "@/types/graphql";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";

import { ReactNode, useRef, useState } from "react";
import { useScrollDirection } from "./useScrollDirection";

const GET_USER_BY_ID_QUERY = gql`
  query getUserById($id: String!) {
    userById(id: $id) {
      name
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation updateUserById($input: UpdateUserByIdInput!) {
    updateUserById(input: $input) {
      user {
        id
        name
      }
    }
  }
`;

export const GlobalHeader = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, loadingUser, signOut } = useAuth();
  const client = useApolloClient();

  const { data, refetch } = useQuery<
    Pick<Query, "userById">,
    QueryUserByIdArgs
  >(GET_USER_BY_ID_QUERY, {
    variables: {
      id: user?.uid ?? "",
    },
  });

  const [updateUserById] = useMutation<Pick<Mutation, "updateUserById">>(
    UPDATE_USER_MUTATION,
    {
      onCompleted: async () => {
        // キャッシュの更新を反映
        refetch();
      },
      onError: (e) => {
        console.error("e", e);
      },
      update: (cache, { data }) => {
        const result = data?.updateUserById;
        const userCache = cache.readQuery<Pick<Query, "userById">>({
          query: GET_USER_BY_ID_QUERY,
        });

        cache.writeQuery({
          query: GET_USER_BY_ID_QUERY,
          data: {
            userById: {
              ...userCache?.userById,
              ...result?.user,
            },
          },
        });
      },
    }
  );

  const headerRef = useRef<HTMLDivElement>(null);
  useScrollDirection(headerRef);

  const nameRef = useRef<HTMLInputElement>(null);
  const [isSettingOpen, handler] = useDisclosure(false);
  const [readOnly, setReadOnly] = useState(true);

  const form = useForm({
    initialValues: { name: "" },
    validate: {
      name: (value) => (value ? null : "名前は必須です"),
    },
  });

  const onClickLogout = async () => {
    await Promise.all([client.resetStore(), signOut()]);
    window.location.href = "/";
  };

  const onClickDeleteUser = () => {
    router.push("/delete-user");
    handler.close();
  };

  const onClickAvatar = () => {
    handler.open();
  };

  const onClickEdit = () => {
    setReadOnly(false);
    nameRef.current?.focus();
  };

  const onSubmit = () => {
    const input: UpdateUserByIdInput = {
      id: user?.uid ?? "",
      userPatch: {
        name: form.values.name,
      },
    };
    updateUserById({
      variables: {
        input,
      },
    });

    // モーダルのコンテンツだけ別コンポーネントにしたほうがリセットしやすいかも
    setReadOnly(true);
    form.reset();
  };

  const onClose = () => {
    handler.close();
    setReadOnly(true);
    form.reset();
  };

  return (
    <div className="flex flex-col">
      <header
        className="sticky top-0 h-12 flex items-center justify-end transition-all px-2 backdrop-blur-md z-50 border-0 border-b border-neutral-700 border-solid"
        ref={headerRef}
      >
        <Link className="mr-auto font-bold" href="/">
          <Text
            fw="bold"
            className="text-3xl"
            component={router.pathname === "/" ? "h1" : "h2"}
          >
            gamelog
          </Text>
        </Link>

        {/* 読込中 */}
        {loadingUser && <div className="flex h-8 w-8 items-center" />}
        {/* ログイン済み */}
        {user && (
          <>
            <Link href="/posts/new">
              <Text
                className="rounded-md px-2 py-1 text-sm font-bold hover:opacity-80"
                bg="blue"
                color="white"
              >
                新規投稿
              </Text>
            </Link>

            <UnstyledButton onClick={onClickAvatar} ml="xs">
              <Avatar variant="filled" color="transparent" />
            </UnstyledButton>
          </>
        )}
        {/* 未ログイン */}
        {!user && !loadingUser && (
          <Link href="/signin">
            <Text
              className="my-1 ml-auto rounded-md px-2 py-1 text-sm font-bold"
              bg="blue"
              color="white"
            >
              ログイン
            </Text>
          </Link>
        )}
      </header>
      {children}
      <Modal
        opened={isSettingOpen}
        onClose={onClose}
        title="ユーザー設定"
        centered
        overlayProps={{
          blur: 2,
        }}
      >
        <Box>
          {/* edit user name */}
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Flex align="end" gap="xs">
              <TextInput
                ref={nameRef}
                placeholder={data?.userById?.name}
                label="ユーザー名"
                className="w-full"
                {...form.getInputProps("name")}
                readOnly={readOnly}
              />
              {readOnly && (
                <Button color="gray" onClick={onClickEdit}>
                  編集
                </Button>
              )}
              {!readOnly && <Button type="submit">保存</Button>}
            </Flex>
          </form>
          <Group position="right" className="mt-8">
            <Button onClick={onClickDeleteUser} color="red">
              永久に削除する場合はこちら
            </Button>
            <Button onClick={onClickLogout} color="red">
              ログアウト
            </Button>
          </Group>
        </Box>
      </Modal>
    </div>
  );
};
