import { Injectable, signal } from '@angular/core';

/** Recipe generations allowed per browser and day (frontend guard). */
export const DAILY_QUOTA = 3;
const STORAGE_KEY = 'cac-quota';

/** Persisted quota record for a single day. */
interface QuotaRecord {
  date: string;
  used: number;
}

/**
 * Tracks the daily recipe-generation quota in the browser so the user sees how
 * many runs are left. The authoritative limit is enforced by n8n (IP-based).
 */
@Injectable({ providedIn: 'root' })
export class QuotaService {
  /** Remaining generations for today (drives the UI). */
  readonly remaining = signal(DAILY_QUOTA);

  constructor() {
    this.remaining.set(DAILY_QUOTA - this.readUsed());
  }

  /** Whether at least one generation is still allowed today. */
  canGenerate(): boolean {
    return this.remaining() > 0;
  }

  /** Record one generation and refresh the remaining count. */
  consume(): void {
    const used = this.readUsed() + 1;
    this.persist(used);
    this.remaining.set(Math.max(0, DAILY_QUOTA - used));
  }

  /** Read today's used count from storage (0 if new day or unavailable). */
  private readUsed(): number {
    const record = this.load();
    return record && record.date === today() ? record.used : 0;
  }

  /** Parse the stored quota record, or null when absent/unavailable. */
  private load(): QuotaRecord | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuotaRecord) : null;
  }

  /** Store today's used count. */
  private persist(used: number): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), used }));
  }
}

/** Current date as an ISO YYYY-MM-DD string. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}
