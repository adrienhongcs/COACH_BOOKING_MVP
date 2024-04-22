import type { Dayjs } from "dayjs";

export const getUserMenuItem = (user) => ({
  key: user.id,
  label: `${user.firstName} ${user.lastName}`,
});

// Return an ISO string with 0 seconds and milliseconds
// and without the timezone indicator for now.
export const formatDatetime = (dayjs: Dayjs) =>
  dayjs?.second(0).millisecond(0).toISOString().slice(0, -1);
