import { ScheduleResponse } from 'nhl-api-client';
import { name, formatDate, formatTime } from '../utils/helpers.js';

export function formatSchedule(data: ScheduleResponse): string {
  const sections: string[] = [];

  for (const week of data.gameWeek) {
    const dateHeader = `${week.dayAbbrev} ${formatDate(week.date)}`;
    const games = week.games.map(g => {
      const time = formatTime(g.startTimeUTC);
      const venue = name(g.venue);
      const matchup = `${g.awayTeam.abbrev} @ ${g.homeTeam.abbrev}`;
      const tvNetworks = g.tvBroadcasts?.map(b => b.network).join(', ') ?? 'No TV';
      const status = g.gameState === 'FINAL' || g.gameState === 'OFF'
        ? `Final: ${g.awayTeam.score}-${g.homeTeam.score}`
        : time;
      return `  ${status} - ${matchup} at ${venue} [${tvNetworks}]`;
    });

    sections.push(`${dateHeader}\n${games.join('\n')}`);
  }

  return sections.join('\n\n');
}
