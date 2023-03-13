import { formatToJP } from "@/lib/format-to-jp";
import {
  Text,
  Card,
  Group,
  Avatar,
  MantineStyleSystemProps,
} from "@mantine/core";

export const SimplePostCard = ({
  title,
  authorName,
  createdAt,
  h,
  w,
}: {
  title: string;
  authorName: string;
  createdAt: string;
  h?: MantineStyleSystemProps["h"];
  w?: MantineStyleSystemProps["w"];
}) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      h={h}
      w={w}
      className="flex flex-col sm:hover:opacity-70"
    >
      <Text size="lg" weight="bold" lineClamp={2} className="break-all">
        {title}
      </Text>
      <Group spacing={2} mt="auto">
        <Avatar
          size="sm"
          // transparentにしている分、余分な空白があるため、マイナスマージンを使用して調整
          ml={-4}
          variant="filled"
          color="transparent"
        />
        <Text size="xs" color="dimmed">
          {authorName}
        </Text>
      </Group>
      <Text size="xs" color="dimmed">
        {formatToJP(createdAt)}
      </Text>
    </Card>
  );
};
