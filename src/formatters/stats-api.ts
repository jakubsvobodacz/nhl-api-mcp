import { table } from '../utils/helpers.js';

export function formatSkaterStats(data: { data: any[]; total: number }, report: string): string {
  if (!data.data.length) return `No skater stats found for report: ${report}`;
  const lines: string[] = [`NHL Skater Stats: ${report} (${data.total} total)\n`];

  if (report === 'summary') {
    const headers = ['Player', 'Pos', 'Team', 'GP', 'G', 'A', 'P', '+/-', 'PIM', 'PPG'];
    const rows = data.data.map(p => [
      p.skaterFullName || '',
      p.positionCode || '',
      p.teamAbbrevs || '',
      String(p.gamesPlayed || 0),
      String(p.goals || 0),
      String(p.assists || 0),
      String(p.points || 0),
      String(p.plusMinus || 0),
      String(p.penaltyMinutes || 0),
      (p.pointsPerGame || 0).toFixed(2),
    ]);
    lines.push(table(headers, rows));
  } else {
    const excludeKeys = new Set(['playerId', 'headshot']);
    const item = data.data[0];
    const keys = Object.keys(item).filter(k => !excludeKeys.has(k));
    const headers = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim().substring(0, 15));
    const rows = data.data.map(p => keys.map(k => {
      const v = p[k];
      if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
      return String(v ?? '');
    }));
    lines.push(table(headers, rows));
  }

  return lines.join('\n');
}

export function formatGoalieStats(data: { data: any[]; total: number }, report: string): string {
  if (!data.data.length) return `No goalie stats found for report: ${report}`;
  const lines: string[] = [`NHL Goalie Stats: ${report} (${data.total} total)\n`];

  if (report === 'summary') {
    const headers = ['Goalie', 'Team', 'GP', 'W', 'L', 'OT', 'GAA', 'SV%', 'SO'];
    const rows = data.data.map(g => [
      g.goalieFullName || '',
      g.teamAbbrevs || '',
      String(g.gamesPlayed || 0),
      String(g.wins || 0),
      String(g.losses || 0),
      String(g.otLosses || 0),
      (g.goalsAgainstAverage || 0).toFixed(2),
      (g.savePct || 0).toFixed(3),
      String(g.shutouts || 0),
    ]);
    lines.push(table(headers, rows));
  } else {
    const excludeKeys = new Set(['playerId', 'headshot']);
    const item = data.data[0];
    const keys = Object.keys(item).filter(k => !excludeKeys.has(k));
    const headers = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim().substring(0, 15));
    const rows = data.data.map(g => keys.map(k => {
      const v = g[k];
      if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
      return String(v ?? '');
    }));
    lines.push(table(headers, rows));
  }

  return lines.join('\n');
}

export function formatTeamStatsReport(data: { data: any[]; total: number }, report: string): string {
  if (!data.data.length) return `No team stats found for report: ${report}`;
  const lines: string[] = [`NHL Team Stats: ${report} (${data.total} total)\n`];

  if (report === 'summary') {
    const headers = ['Team', 'GP', 'W', 'L', 'OT', 'PTS', 'PT%'];
    const rows = data.data.map(t => [
      t.teamFullName || t.triCode || '',
      String(t.gamesPlayed || 0),
      String(t.wins || 0),
      String(t.losses || 0),
      String(t.otLosses || 0),
      String(t.points || 0),
      (t.pointPct || 0).toFixed(3),
    ]);
    lines.push(table(headers, rows));
  } else {
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
  }

  return lines.join('\n');
}

export function formatMilestones(data: { data: any[]; total: number }): string {
  if (!data.data.length) return 'No milestones found';
  const lines: string[] = [`NHL Player Milestones (${data.total} total)\n`];

  const excludeKeys = new Set(['playerId', 'headshot']);
  const item = data.data[0];
  const keys = Object.keys(item).filter(k => !excludeKeys.has(k));
  const headers = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim().substring(0, 15));
  const rows = data.data.map(m => keys.map(k => {
    const v = m[k];
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
    return String(v ?? '');
  }));
  lines.push(table(headers, rows));

  return lines.join('\n');
}
