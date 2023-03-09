import { LoginForm } from "@/components/Form/loginForm";
import { useAuth } from "@/hooks/useAuth";
import { Box, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import Head from "next/head";
import Link from "next/link";

export default function SignIn() {
  const { signIn } = useAuth();

  const onSubmit = (values: { email: string; pw: string }) => {
    signIn(values.email, values.pw);
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="mt-24 mb-12">Sign In</h1>
        <Box className="w-72">
          <LoginForm onSubmit={onSubmit} />
          <Divider className="my-2" />
          <span className="text-sm">
            登録は<Link href="/signup">こちら</Link>
          </span>
        </Box>
      </main>
    </>
  );
}
