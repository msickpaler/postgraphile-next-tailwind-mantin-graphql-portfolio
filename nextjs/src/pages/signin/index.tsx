import { LoginForm } from "@/components/Form/LoginForm";
import { infoModalDefaultArgs } from "@/components/Modal/InfoModal";
import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/layouts/GlobalHeader";
import { Box, Divider } from "@mantine/core";
import { modals } from "@mantine/modals";
import { FirebaseError } from "firebase/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const SignIn: NextPageWithLayout = () => {
  const { signIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (values: { email: string; pw: string }) => {
    try {
      await signIn(values.email, values.pw);
      router.replace("/");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === "auth/user-not-found") {
          modals.openContextModal({
            ...infoModalDefaultArgs,
            title: "ログインエラー",
            innerProps: {
              description: "ユーザーが見つかりませんでした",
            },
          });
          return;
        }
      }

      modals.openContextModal({
        ...infoModalDefaultArgs,
        title: "ログインエラー",
        innerProps: {
          description: "不明のエラーが発生しました",
        },
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="mt-12 mb-12">Sign In</h1>
        <Box className="w-72">
          <LoginForm onSubmit={onSubmit} />
          <Divider className="my-2" />
          <span className="text-sm">
            登録は
            <Link href="/signup" className="underline">
              こちら
            </Link>
          </span>
        </Box>
      </main>
    </>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <GlobalHeader>{page}</GlobalHeader>;
};

export default SignIn;
