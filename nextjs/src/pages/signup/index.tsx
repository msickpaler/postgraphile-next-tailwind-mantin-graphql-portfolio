import { LoginForm } from "@/components/Form/LoginForm";
import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { CreateUserInput } from "@/types/graphql";
import { gql, useMutation } from "@apollo/client";
import { Box, Divider } from "@mantine/core";
import { modals } from "@mantine/modals";
import { FirebaseError } from "firebase/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        name
      }
    }
  }
`;

const SignUp: NextPageWithLayout = () => {
  const { signUp } = useAuth();
  const router = useRouter();

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
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

  const onSubmit = async (values: { email: string; pw: string }) => {
    try {
      const result = await signUp(values.email, values.pw);
      const token = await result.user.getIdToken();

      const input: CreateUserInput = {
        user: {
          id: result.user.uid,
          name: "新規ユーザー",
          updatedAt: "2021-08-01T00:00:00.000Z",
        },
      };

      createUser({
        variables: {
          input,
        },
        context: {
          headers: {
            // 登録後はuseAuthのtokenはすぐには反映されないので、個別に設定する
            authorization: `Bearer ${token}`,
          },
        },
      });
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === "auth/email-already-in-use") {
          modals.openContextModal({
            ...infoModalDefaultArgs,
            title: "登録エラー",
            innerProps: {
              description: "このメールアドレスはすでに使用されています",
            },
          });
          return;
        }
      }

      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "登録エラー",
        innerProps: {
          description: "不明のエラーが発生しました",
        },
      });
      return;
    }
  };

  return (
    <>
      <Head>
        <title>アカウント登録</title>
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="mt-12 mb-12">アカウント登録</h1>
        <Box className="w-72">
          <LoginForm onSubmit={onSubmit} />
          <Divider className="my-2" />
          <span className="text-sm">
            ログインは
            <Link href="/signin" className="underline">
              こちら
            </Link>
          </span>
        </Box>
      </main>
    </>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <GlobalHeader>{page}</GlobalHeader>;
};

export default SignUp;
