/**
 * Label for the diet chip. The backend may echo the raw preference key, so
 * "none" is dropped instead of being shown as a meaningless chip.
 */
export function dietLabel(diet: string): string {
  const value = (diet ?? '').trim();
  return value.toLowerCase() === 'none' ? '' : value;
}
