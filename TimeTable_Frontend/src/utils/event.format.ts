export const formatThaiDate = (date: Date): string => new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);

export const formatThaiTime = (date: Date): string => new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);

export const formatTimeRange = (start: Date, end: Date): string => `${formatThaiTime(start)} - ${formatThaiTime(end)}`;