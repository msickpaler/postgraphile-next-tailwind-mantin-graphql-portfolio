import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { Text, Button, Flex, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { NextPageWithLayout } from "../_app";
import { DeleteUserByIdInput } from "@/types/graphql";
import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
import { modals } from "@mantine/modals";

const DELETE_USER_MUTATION = gql`
  mutation deleteUserById($input: DeleteUserByIdInput!) {
    deleteUserById(input: $input) {
      user {
        id
        name
      }
    }
  }
`;

const DeleteUser: NextPageWithLayout = () => {
  const { user, loadingUser } = useAuth();
  const router = useRouter();
  const client = useApolloClient();
  const [deleteUserById] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: async () => {
      try {
        // バックエンドで削除するのがちょっと面倒だったのでfirebaseユーザーはここで削除する
        await user?.delete();
        await client.resetStore();
        window.location.href = "/";
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
    onError: () => {
      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "削除エラー",
        innerProps: {
          description: "不明のエラーが発生しました",
        },
      });
    },
  });

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => {
        if (value !== user?.email) {
          return "メールアドレスが一致しません";
        }
      },
    },
  });

  const handlePhysicalDelete = (values: { email: string }) => {
    if (!user) {
      return;
    }

    const input: DeleteUserByIdInput = {
      id: user.uid,
    };
    deleteUserById({
      variables: {
        input,
      },
    });

    router.replace("/");
  };

  return (
    <>
      <Head>
        <title>Delete User</title>
      </Head>
      <Flex direction="column" align="center" className="w-full">
        <h1 className="mt-12 mb-12">アカウント削除</h1>
        <Text>
          このユーザーを削除するにはメールアドレスを入力してください。
        </Text>
        <Text mb="xl">🔥この操作は取り消せません🔥</Text>
        <form className="w-72" onSubmit={form.onSubmit(handlePhysicalDelete)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <Group position="right" mt="md">
            <Button type="submit" disabled={loadingUser}>
              永久に削除
            </Button>
          </Group>
        </form>
      </Flex>
    </>
  );
};

DeleteUser.getLayout = function getLayout(page: ReactElement) {
  return <GlobalHeader>{page}</GlobalHeader>;
};

export default DeleteUser;
