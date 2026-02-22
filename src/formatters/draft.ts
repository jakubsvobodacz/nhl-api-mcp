import { DraftRankingsResponse, DraftPicksResponse } from 'nhl-api-client';
import { table } from '../utils/helpers.js';

export function formatDraft(data: DraftRankingsResponse | DraftPicksResponse, type: 'rankings' | 'picks'): string {
  if (type === 'rankings') {
    const rankings = data as DraftRankingsResponse;
    if (!rankings.rankings || rankings.rankings.length === 0) {
      return 'No draft rankings found.';
    }
    const rows = rankings.rankings.slice(0, 50).map((p: DraftRankingsResponse['rankings'][number]) => [
      p.midtermRank ?? p.finalRank ?? '-',
      `${p.firstName} ${p.lastName}`,
      p.positionCode ?? '-',
      p.lastAmateurClub ?? '-',
      p.lastAmateurLeague ?? '-',
    ]);
    return `Draft ${rankings.draftYear} Rankings\n\n` + table(['Rank', 'Name', 'Pos', 'Club', 'League'], rows);
  } else {
    const picks = data as DraftPicksResponse;
    if (!picks.rounds || picks.rounds.length === 0) {
      return 'No draft picks found.';
    }
    const rows: (string | number)[][] = [];
    for (const round of picks.rounds) {
      for (const p of round.picks) {
        rows.push([
          p.round,
          p.pickInRound,
          p.teamAbbrev ?? '-',
          `${p.firstName} ${p.lastName}`,
          p.positionCode ?? '-',
        ]);
      }
    }
    return `Draft ${picks.draftYear} Picks\n\n` + table(['Round', 'Pick', 'Team', 'Player', 'Pos'], rows);
  }
}
