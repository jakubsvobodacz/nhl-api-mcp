import { table } from '../utils/helpers.js';

export function formatEdgeSkaterStats(data: { data: any[]; total: number }, report: string): string {
  if (!data.data.length) return `No skater edge data found for report: ${report}`;
  const lines: string[] = [`NHL Edge Skater Stats: ${report} (${data.total} total)\n`];

  const excludeKeys = new Set(['playerId', 'headshot', 'teamLogo']);
  const item = data.data[0];
  const keys = Object.keys(item).filter(k => !excludeKeys.has(k));

  const headers = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim().substring(0, 15));
  const rows = data.data.map(p => keys.map(k => {
    const v = p[k];
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
    return String(v ?? '');
  }));

  lines.push(table(headers, rows));
  return lines.join('\n');
}

export function formatEdgeTeamStats(data: { data: any[]; total: number }, report: string): string {
  if (!data.data.length) return `No team edge data found for report: ${report}`;
  const lines: string[] = [`NHL Edge Team Stats: ${report} (${data.total} total)\n`];

  const excludeKeys = new Set(['teamId', 'teamLogo']);
  const item = data.data[0];
  const keys = Object.keys(item).filter(k => !excludeKeys.has(k));

  const headers = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim().substring(0, 15));
  const rows = data.data.map(t => keys.map(k => {
    const v = t[k];
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
    return String(v ?? '');
  }));

  lines.push(table(headers, rows));
  return lines.join('\n');
}

export function formatEdgeGoalieStats(data: { data: any[]; total: number }, report: string): string {
  if (!data.data.length) return `No goalie edge data found for report: ${report}`;
  const lines: string[] = [`NHL Edge Goalie Stats: ${report} (${data.total} total)\n`];

  const excludeKeys = new Set(['playerId', 'headshot', 'teamLogo']);
  const item = data.data[0];
  const keys = Object.keys(item).filter(k => !excludeKeys.has(k));

  const headers = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim().substring(0, 15));
  const rows = data.data.map(g => keys.map(k => {
    const v = g[k];
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
    return String(v ?? '');
  }));

  lines.push(table(headers, rows));
  return lines.join('\n');
}
