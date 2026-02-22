import { ProspectStats } from 'nhl-api-client';

export function formatProspects(data: ProspectStats): string {
  if (!data || typeof data !== 'object') {
    return 'No prospect data available.';
  }

  const entries = Object.entries(data).filter(([k, v]) => v !== null && v !== undefined);
  if (entries.length === 0) {
    return 'No prospect data available.';
  }

  return entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
}
