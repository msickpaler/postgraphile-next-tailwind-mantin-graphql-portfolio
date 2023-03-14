import { Box, Textarea } from "@mantine/core";

const BODY_MAX_LENGTH = 65535;

export const PostForm = ({
  title,
  body,
  handleChangeTitle,
  handleChangeBody,
}: {
  title: string;
  body: string;
  handleChangeTitle: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleChangeBody: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <>
      <Textarea
        value={title}
        onChange={handleChangeTitle}
        placeholder="タイトル"
        maxLength={255}
        autosize
        size="xl"
        variant="unstyled"
      />
      <Box pos="relative">
        <Textarea
          value={body}
          onChange={handleChangeBody}
          placeholder="本文"
          maxLength={BODY_MAX_LENGTH}
          autosize
          variant="filled"
          classNames={{
            // borderはもともと透明のものを可視化してるようなのでnoneではなくtransparentでレイアウトを維持する
            input: "focus-visible:border-transparent",
          }}
          minRows={10}
        />
        <Box
          pos="absolute"
          right={8}
          bottom={4}
          fz="sm"
          className="text-neutral-500"
        >
          {body.length}/{BODY_MAX_LENGTH}
        </Box>
      </Box>
    </>
  );
};
