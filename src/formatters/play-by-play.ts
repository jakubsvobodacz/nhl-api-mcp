import { PlayByPlay, RosterSpot } from 'nhl-api-client';
import { name } from '../utils/helpers.js';

export function formatPlayByPlay(data: PlayByPlay, eventTypes?: string): string {
  const filters = eventTypes?.split(',').map(t => t.trim().toLowerCase()) ?? ['goal', 'penalty'];
  const filtered = data.plays.filter(p => {
    const typeKey = (p.typeDescKey ?? '').toLowerCase();
    return filters.some(f => typeKey.includes(f));
  });

  if (filtered.length === 0) {
    return 'No matching events found.';
  }

  const rosterMap = new Map<number, string>();
  if (data.rosterSpots) {
    for (const spot of data.rosterSpots) {
      if (spot.playerId && spot.firstName && spot.lastName) {
        rosterMap.set(spot.playerId, `${name(spot.firstName)} ${name(spot.lastName)}`);
      }
    }
  }

  const periods = new Map<string, typeof filtered>();
  for (const play of filtered) {
    const periodKey = `${play.periodDescriptor?.periodType ?? 'Period'} ${play.periodDescriptor?.number ?? ''}`;
    if (!periods.has(periodKey)) periods.set(periodKey, []);
    periods.get(periodKey)!.push(play);
  }

  const sections: string[] = [];
  for (const [periodKey, plays] of periods) {
    sections.push(`${periodKey}`);
    for (const play of plays) {
      const desc = formatPlayDescription(play, rosterMap);
      sections.push(`  ${play.timeInPeriod} - ${desc}`);
    }
  }

  return sections.join('\n');
}

function formatPlayDescription(play: PlayByPlay['plays'][number], rosterMap: Map<number, string>): string {
  const typeKey = play.typeDescKey ?? '';

  if (typeKey.includes('goal')) {
    const scorer = rosterMap.get(play.details?.scoringPlayerId as number) ?? 'Unknown';
    const assist1 = play.details?.assist1PlayerId ? rosterMap.get(play.details.assist1PlayerId as number) : null;
    const assist2 = play.details?.assist2PlayerId ? rosterMap.get(play.details.assist2PlayerId as number) : null;
    const assists = [assist1, assist2].filter(Boolean).join(', ') || 'unassisted';
    const score = `${play.details?.awayScore ?? 0}-${play.details?.homeScore ?? 0}`;
    return `GOAL: ${scorer} (${assists}) ${score}`;
  }

  if (typeKey.includes('penalty')) {
    const player = rosterMap.get(play.details?.committedByPlayerId as number) ?? 'Unknown';
    const desc = (play.details?.descKey as string) ?? typeKey;
    const duration = play.details?.duration ?? 0;
    return `PENALTY: ${player} - ${desc} (${duration} min)`;
  }

  return typeKey;
}
