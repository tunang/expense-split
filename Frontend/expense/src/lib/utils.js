import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function modifyDate(isoString, adjustments = {}) {
  const date = new Date(isoString);

  if (adjustments.days) {
    date.setUTCDate(date.getUTCDate() + adjustments.days);
  }
  if (adjustments.hours) {
    date.setUTCHours(date.getUTCHours() + adjustments.hours);
  }
  if (adjustments.minutes) {
    date.setUTCMinutes(date.getUTCMinutes() + adjustments.minutes);
  }
  if (adjustments.seconds) {
    date.setUTCSeconds(date.getUTCSeconds() + adjustments.seconds);
  }
  if (adjustments.milliseconds) {
    date.setUTCMilliseconds(date.getUTCMilliseconds() + adjustments.milliseconds);
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() is 0-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
