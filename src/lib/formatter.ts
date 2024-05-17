export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-uk", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return formatter.format(date);
};

export const formatNum = (number: string | number) => {
  const formatter = new Intl.NumberFormat("en-us");

  return formatter.format(+number);
};
