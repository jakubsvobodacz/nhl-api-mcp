import { PlayerGameLog } from 'nhl-api-client';
import { table } from '../utils/helpers.js';

export function formatGameLog(data: PlayerGameLog): string {
  if (!data.gameLog || data.gameLog.length === 0) {
    return 'No games found in game log.';
  }

  const firstGame = data.gameLog[0];
  const isGoalie = 'decision' in firstGame || 'savePctg' in firstGame;

  if (isGoalie) {
    const headers = ['Date', 'Team', 'H/A', 'Dec', 'SA', 'GA', 'SV%', 'SO', 'TOI'];
    const rows = data.gameLog.map(g => [
      g.gameDate,
      g.teamAbbrev,
      g.homeRoadFlag,
      (g as any).decision ?? '-',
      (g as any).shotsAgainst ?? 0,
      (g as any).goalsAgainst ?? 0,
      (g as any).savePctg ? ((g as any).savePctg * 100).toFixed(1) + '%' : '-',
      (g as any).shutouts ?? 0,
      g.toi ?? '-',
    ]);
    return table(headers, rows);
  } else {
    const headers = ['Date', 'Team', 'H/A', 'G', 'A', 'PTS', '+/-', 'SOG', 'PIM', 'TOI'];
    const rows = data.gameLog.map(g => [
      g.gameDate,
      g.teamAbbrev,
      g.homeRoadFlag,
      g.goals ?? 0,
      g.assists ?? 0,
      g.points ?? 0,
      g.plusMinus ?? 0,
      g.shots ?? 0,
      g.pim ?? 0,
      g.toi ?? '-',
    ]);
    return table(headers, rows);
  }
}
