import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
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
  CheckIcon,
  Group,
  Header,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { useRouter } from "next/router";

import { ReactNode, useEffect, useRef, useState } from "react";
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

  const [succeeded, setSucceeded] = useState(false);
  const [updateUserById, { loading }] = useMutation<
    Pick<Mutation, "updateUserById">
  >(UPDATE_USER_MUTATION, {
    onCompleted: async () => {
      // キャッシュの更新を反映
      refetch();
      setSucceeded(true);
      setTimeout(() => {
        setSucceeded(false);
      }, 2000);
    },
    onError: (e) => {
      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "更新エラー",
        innerProps: {
          description: "不明のエラーが発生しました",
        },
      });
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
  });

  const headerRef = useRef<HTMLDivElement>(null);
  useScrollDirection(headerRef);

  const [isSettingOpen, handler] = useDisclosure(false);

  const [userName, setUserName] = useState("");
  const [debouncedName] = useDebouncedValue(userName, 800);

  const [inputtedAtLeastOnce, setInputtedAtLeastOnce] = useState(false);
  const showValidationMsg =
    inputtedAtLeastOnce && (userName.length === 0 || userName.length > 255);

  const isValidDebouncedName =
    0 < debouncedName.length && debouncedName.length <= 255;

  useEffect(() => {
    if (!isValidDebouncedName) {
      return;
    }

    const input: UpdateUserByIdInput = {
      id: user?.uid ?? "",
      userPatch: {
        name: debouncedName,
      },
    };
    updateUserById({
      variables: {
        input,
      },
    });
  }, [
    debouncedName,
    inputtedAtLeastOnce,
    isValidDebouncedName,
    updateUserById,
    user?.uid,
  ]);

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

  const onClose = () => {
    handler.close();
    setUserName("");
    setInputtedAtLeastOnce(false);
  };

  return (
    <div className="flex flex-col">
      <Header
        className="sticky top-0 p-1 flex items-center justify-end transition-all px-2 backdrop-blur-md z-50 border-0 border-b border-neutral-700 border-solid"
        height="auto"
        ref={headerRef}
      >
        <Link className="mr-4 font-bold" href="/">
          <Text
            fw="bold"
            className="text-3xl my-0"
            component={router.pathname === "/" ? "h1" : "h2"}
          >
            gamelog
          </Text>
        </Link>
        <Link className="mr-auto font-bold" href="/data">
          <Text fw="bold" className="text-xl my-0 underline">
            data
          </Text>
        </Link>

        {/* ログイン済み */}
        {user && (
          <>
            <Button component={Link} href="/posts/new">
              新規投稿
            </Button>

            <UnstyledButton onClick={onClickAvatar} ml="xs">
              <Avatar variant="filled" color="transparent" />
            </UnstyledButton>
          </>
        )}
        {/* 未ログイン */}
        {!user && !loadingUser && (
          <Button component={Link} href="/signin">
            ログイン
          </Button>
        )}
      </Header>
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
          <Stack spacing={0}>
            <TextInput
              placeholder={data?.userById?.name}
              label="ユーザー名"
              className="w-full"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
              onInput={() => setInputtedAtLeastOnce(true)}
              rightSection={
                <>
                  {loading ? (
                    <Loader size="sm" />
                  ) : succeeded ? (
                    <CheckIcon color="#19BA3A" width={20} />
                  ) : null}
                </>
              }
            />
            {showValidationMsg && (
              <Text color="red" size="sm">
                1~255文字で入力してください
              </Text>
            )}
          </Stack>
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
