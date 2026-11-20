import { format } from "date-fns";

export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return format(date, "dd MMM yyyy");
}
