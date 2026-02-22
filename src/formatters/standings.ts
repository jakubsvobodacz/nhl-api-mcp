import { StandingsResponse } from 'nhl-api-client';
import { name, table } from '../utils/helpers.js';

export function formatStandings(data: StandingsResponse): string {
  const { standings } = data;
  const divisions = new Map<string, typeof standings>();

  for (const entry of standings) {
    const divName = name(entry.divisionName);
    if (!divisions.has(divName)) {
      divisions.set(divName, []);
    }
    divisions.get(divName)!.push(entry);
  }

  const sections: string[] = [];
  for (const [divName, teams] of divisions) {
    const rows = teams.map(t => [
      name(t.teamAbbrev),
      t.gamesPlayed,
      t.wins,
      t.losses,
      t.otLosses,
      t.points,
      t.goalDifferential > 0 ? `+${t.goalDifferential}` : String(t.goalDifferential),
      `${t.streakCode}${t.streakCount}`,
      `${t.l10Wins}-${t.l10Losses}-${t.l10OtLosses}`,
    ]);
    sections.push(`${divName}\n${table(['Team', 'GP', 'W', 'L', 'OTL', 'PTS', 'GD', 'STRK', 'L10'], rows)}`);
  }

  return sections.join('\n\n');
}
