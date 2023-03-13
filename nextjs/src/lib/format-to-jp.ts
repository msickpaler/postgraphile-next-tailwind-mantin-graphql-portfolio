export const formatToJP = (date: string) => {
  // use Intl.DateTimeFormat to format date include time
  const formatter = new Intl.DateTimeFormat("JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(new Date(date));
};
