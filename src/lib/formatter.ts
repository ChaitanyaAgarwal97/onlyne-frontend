export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
  });

  return formatter.format(date);
};
