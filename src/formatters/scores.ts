import { ScoresResponse } from 'nhl-api-client';
import { formatDate, formatTime } from '../utils/helpers.js';

export function formatScores(data: ScoresResponse): string {
  const sections: string[] = [];

  for (const day of data.gamesByDate) {
    const dateHeader = formatDate(day.date);
    const games = day.games.map(g => {
      const awayScore = g.awayTeam.score ?? '-';
      const homeScore = g.homeTeam.score ?? '-';
      const status = getGameStatus(g.gameState, g.periodDescriptor, g.startTimeUTC);
      return `${g.awayTeam.abbrev} ${awayScore} - ${homeScore} ${g.homeTeam.abbrev} (${status})`;
    });

    sections.push(`${dateHeader}\n${games.join('\n')}`);
  }

  return sections.join('\n\n');
}

function getGameStatus(gameState: string, period: any, startTime: string): string {
  if (gameState === 'FINAL' || gameState === 'OFF') {
    return 'Final';
  }
  if (gameState === 'LIVE' || gameState === 'CRIT') {
    return period ? `${period.periodType} ${period.number}` : 'Live';
  }
  return formatTime(startTime);
}
