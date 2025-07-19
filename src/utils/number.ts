export function toNumberOrZero(value: any): number {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}
