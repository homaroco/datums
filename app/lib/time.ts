export const getTimestamp = (time: number) => {
  const date = new Date(time);
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  return (
    (dayDiff === 0 && diff < 5 && "now") ||
    (diff < 60 && Math.floor(diff) + "s") ||
    (diff < 120 && "1m") ||
    (diff < 3600 && Math.floor(diff / 60) + "m") ||
    (diff < 7200 && "1h") ||
    (diff < 86400 && Math.floor(diff / 3600) + "h") ||
    (dayDiff < 7 && dayDiff + "d") ||
    (dayDiff < 30 && Math.floor(dayDiff / 7) + "w") ||
    (dayDiff < 365 && Math.floor(dayDiff / 30) + "mo") ||
    Math.floor(dayDiff / 365) + "y"
  );
};
