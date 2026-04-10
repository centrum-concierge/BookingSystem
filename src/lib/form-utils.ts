/** Extracts a trimmed string value from FormData. Returns "" if the key is missing. */
export function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}
