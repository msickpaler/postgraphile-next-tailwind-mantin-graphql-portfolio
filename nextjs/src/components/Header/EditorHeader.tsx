import { Header, Button } from "@mantine/core";

export const EditorHeader = ({
  onClickBack,
  onClickSave,
  disabled,
}: {
  onClickBack: () => void;
  onClickSave: () => void;
  disabled: boolean;
}) => {
  return (
    <Header
      height="auto"
      p="xs"
      className="sticky flex items-center justify-end border-solid border-0 border-b border-neutral-700 backdrop-blur-md z-50"
      top={0}
    >
      <Button fz="xl" mr="auto" color="transparent" onClick={onClickBack}>
        ←
      </Button>
      <Button onClick={onClickSave} disabled={disabled}>
        保存
      </Button>
    </Header>
  );
};
