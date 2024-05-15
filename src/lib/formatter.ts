export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
  });

  return formatter.format(date);
};

export const formatNum = (number: string | number) => {
  const formatter = new Intl.NumberFormat("en-us");

  return formatter.format(+number);
};
