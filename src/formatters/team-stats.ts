import { TeamSeasonStats } from 'nhl-api-client';
import { name, table, pctg } from '../utils/helpers.js';

export function formatTeamStats(data: TeamSeasonStats): string {
  const sections: string[] = [];

  if (data.skaters && data.skaters.length > 0) {
    const sorted = [...data.skaters].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    const rows = sorted.map(p => [
      `${name(p.firstName)} ${name(p.lastName)}`,
      p.positionCode,
      p.gamesPlayed ?? 0,
      p.goals ?? 0,
      p.assists ?? 0,
      p.points ?? 0,
      p.plusMinus ?? 0,
      p.pim ?? 0,
      p.shots ?? 0,
      pctg(p.shootingPctg),
      p.avgToi ?? '-',
    ]);
    sections.push(`SKATERS\n${table(['Name', 'Pos', 'GP', 'G', 'A', 'PTS', '+/-', 'PIM', 'SOG', 'S%', 'TOI/G'], rows)}`);
  }

  if (data.goalies && data.goalies.length > 0) {
    const sorted = [...data.goalies].sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0));
    const rows = sorted.map(g => [
      `${name(g.firstName)} ${name(g.lastName)}`,
      g.gamesPlayed ?? 0,
      g.wins ?? 0,
      g.losses ?? 0,
      g.otLosses ?? 0,
      (g.goalsAgainstAvg ?? 0).toFixed(2),
      pctg(g.savePctg),
      g.shutouts ?? 0,
    ]);
    sections.push(`GOALIES\n${table(['Name', 'GP', 'W', 'L', 'OTL', 'GAA', 'SV%', 'SO'], rows)}`);
  }

  return sections.join('\n\n');
}
