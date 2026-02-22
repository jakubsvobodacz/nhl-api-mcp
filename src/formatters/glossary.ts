import { StatsApiResponse, GlossaryEntry } from 'nhl-api-client';

export function formatGlossary(data: StatsApiResponse<GlossaryEntry>, term?: string): string {
  if (!data.data || data.data.length === 0) {
    return 'No glossary entries found.';
  }

  let entries = data.data;
  if (term) {
    const q = term.toLowerCase();
    entries = entries.filter(e => {
      const abbrev = String(e.abbreviation ?? '').toLowerCase();
      const desc = String(e.description ?? '').toLowerCase();
      return abbrev.includes(q) || desc.includes(q);
    });
  }

  if (entries.length === 0) {
    return `No glossary entries found for "${term}".`;
  }

  return entries.map(e => `${e.abbreviation}: ${e.description}`).join('\n');
}
