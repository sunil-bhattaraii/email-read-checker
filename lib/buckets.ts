export function hourKey(date: Date): string {
  return date.toISOString().slice(0, 13);
}
