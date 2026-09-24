export function parsePage(raw: string | undefined | null): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function isValidPage(raw: string | null): boolean {
  if (raw === null) return true; // ausente é ok, assume página 1
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1;
}