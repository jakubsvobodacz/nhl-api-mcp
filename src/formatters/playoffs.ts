import { PlayoffBracket, PlayoffSeriesCarousel, PlayoffSeriesSchedule } from 'nhl-api-client';
import { name, formatDate, formatTime } from '../utils/helpers.js';

export function formatPlayoffs(data: PlayoffBracket | PlayoffSeriesCarousel | PlayoffSeriesSchedule, type: string): string {
  if (type === 'bracket') {
    const bracket = data as PlayoffBracket;
    if (!bracket.rounds || bracket.rounds.length === 0) {
      return 'No playoff bracket available.';
    }
    const sections: string[] = [];
    for (const round of bracket.rounds) {
      sections.push(`Round ${round.roundNumber} (${round.roundAbbrev}):`);
      for (const series of round.series) {
        const topSeed = `${name(series.matchup?.topSeed?.name)} (${series.matchup?.topSeed?.abbrev})`;
        const bottomSeed = `${name(series.matchup?.bottomSeed?.name)} (${series.matchup?.bottomSeed?.abbrev})`;
        const score = `${series.topSeedWins ?? 0}-${series.bottomSeedWins ?? 0}`;
        sections.push(`  ${topSeed} vs ${bottomSeed} [${score}]`);
      }
    }
    return sections.join('\n');
  }

  if (type === 'series') {
    const carousel = data as PlayoffSeriesCarousel;
    if (!carousel.rounds || carousel.rounds.length === 0) {
      return 'No playoff series available.';
    }
    const sections: string[] = [];
    for (const round of carousel.rounds) {
      sections.push(`Round ${round.roundNumber} (${round.roundAbbrev}):`);
      for (const series of round.series) {
        const top = `${name(series.topSeedTeam?.name)} (${series.topSeedTeam?.abbrev})`;
        const bottom = `${name(series.bottomSeedTeam?.name)} (${series.bottomSeedTeam?.abbrev})`;
        const score = `${series.topSeedWins}-${series.bottomSeedWins}`;
        sections.push(`  ${series.seriesTitle}: ${top} vs ${bottom} [${score}]`);
      }
    }
    return sections.join('\n');
  }

  if (type === 'schedule') {
    const schedule = data as PlayoffSeriesSchedule;
    if (!schedule.games || schedule.games.length === 0) {
      return 'No playoff games scheduled.';
    }
    const rows = schedule.games.map(g => {
      const date = formatDate(g.startTimeUTC);
      const time = formatTime(g.startTimeUTC);
      const matchup = `${g.awayTeam.abbrev} @ ${g.homeTeam.abbrev}`;
      const score = g.gameState === 'FINAL' || g.gameState === 'OFF'
        ? `${g.awayTeam.score ?? 0}-${g.homeTeam.score ?? 0}`
        : 'TBD';
      return `Game ${g.seriesGameNumber}: ${date} ${time} - ${matchup} ${score}`;
    });
    return `${schedule.seriesTitle}\n${rows.join('\n')}`;
  }

  return 'Unknown playoff data type.';
}
