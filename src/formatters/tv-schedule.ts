import { table, formatDate, formatTime } from '../utils/helpers.js';

interface TvGame {
  id: number;
  startTimeUTC: string;
  awayTeam: { abbrev: string };
  homeTeam: { abbrev: string };
  tvBroadcasts?: { network: string; market: string; countryCode: string }[];
}

interface TvData {
  date: string;
  games: TvGame[];
}

export function formatTvSchedule(data: TvData): string {
  if (!data.games || data.games.length === 0) {
    return 'No games scheduled for TV broadcast.';
  }

  const rows = data.games.map((g: TvGame) => {
    const time = formatTime(g.startTimeUTC);
    const matchup = `${g.awayTeam.abbrev} @ ${g.homeTeam.abbrev}`;
    const broadcasts = g.tvBroadcasts?.map((b: { network: string; market: string }) => `${b.network} (${b.market})`).join(', ') ?? 'None';
    return [time, matchup, broadcasts];
  });

  return `${formatDate(data.date)}\n${table(['Time', 'Matchup', 'Broadcasts'], rows)}`;
}
