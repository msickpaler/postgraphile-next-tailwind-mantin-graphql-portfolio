import { Text, Button } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";

export const infoModalDefaultArgs = {
  modal: "info",
  centered: true,
  withCloseButton: false,
};

export const InfoModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ description: string }>) => (
  <>
    <Text size="sm">{innerProps.description}</Text>
    <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
      閉じる
    </Button>
  </>
);
