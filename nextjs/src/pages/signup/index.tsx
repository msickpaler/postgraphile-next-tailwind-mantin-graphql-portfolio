import { LoginForm } from "@/components/Form/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { CreateUserInput } from "@/types/graphql";
import { gql, useMutation } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Box, Divider } from "@mantine/core";
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
      window.location.href = "/";
    },
    onError: (e) => {
      console.error("e", e);
    },
  });

  const onSubmit = async (values: { email: string; pw: string }) => {
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

    router.replace("/");
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="mt-12 mb-12">Sign Up</h1>
        <Box className="w-72">
          <LoginForm onSubmit={onSubmit} />
          <Divider className="my-2" />
          <span className="text-sm">
            ログインは
            <Link href="/login" className="underline">
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
