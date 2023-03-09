import { TextInput, PasswordInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

const initialValues = {
  email: "",
  pw: "",
};

export const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (value: typeof initialValues) => void;
}) => {
  const form = useForm({
    initialValues,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      pw: (value) =>
        value.length > 5 ? null : "Password must be at least 6 characters long",
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label="Email"
        placeholder="your@email.com"
        {...form.getInputProps("email")}
      />

      <PasswordInput mt="md" label="Password" {...form.getInputProps("pw")} />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};
