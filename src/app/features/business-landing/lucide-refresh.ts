import { createIcons, icons } from 'lucide';

/** Replaces [data-lucide] nodes after dynamic views update. */
export function refreshLucideIcons(): void {
  createIcons({ icons });
}
