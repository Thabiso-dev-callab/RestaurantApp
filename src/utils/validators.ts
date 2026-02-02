export function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function minLen(value: string, n: number) {
  return value.trim().length >= n;
}
