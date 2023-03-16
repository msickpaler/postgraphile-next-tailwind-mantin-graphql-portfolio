const to2digit = (num: number) => num.toString().padStart(2, "0");

export const formatToJP = (date: string) => {
  if (typeof window === "undefined") {
    const d = new Date(date);
    const ymd = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    const t = `${to2digit(d.getHours())}:${to2digit(d.getMinutes())}`;
    return `${ymd} ${t}`;
  }
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
