/** One entry in the pager: a page number, or an ellipsis marker. */
export type PageToken = number | 'gap';

/** Inclusive list of page numbers from `from` to `to`. */
function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

/**
 * Build the compact pager the design shows ("< 1 2 3 … 8 >"): a short window of
 * pages around the current one, an ellipsis, and always the last page.
 */
export function pageTokens(current: number, total: number, span = 3): PageToken[] {
  if (total <= span + 2) return range(1, total);
  const start = Math.min(Math.max(1, current - 1), total - span);
  const window = range(start, start + span - 1);
  const head: PageToken[] = start > 1 ? [1, 'gap', ...window] : [...window];
  return head.includes(total) ? head : [...head, 'gap', total];
}
