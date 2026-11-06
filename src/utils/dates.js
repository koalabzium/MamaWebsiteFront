// Today's date as YYYY-MM-DD in the user's local timezone (what an
// <input type="date"> expects). toISOString() would use UTC and give
// yesterday's date late in the evening.
export const todayLocal = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
