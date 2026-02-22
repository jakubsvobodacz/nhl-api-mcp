import { GameLanding } from 'nhl-api-client';
import { name } from '../utils/helpers.js';

export function formatGameStory(data: GameLanding): string {
  const sections: string[] = [];

  sections.push(`${name(data.awayTeam.name)} @ ${name(data.homeTeam.name)}`);

  if (data.summary?.threeStars) {
    sections.push(`\nTHREE STARS:`);
    for (const star of data.summary.threeStars) {
      const statLine = star.goals !== undefined
        ? `${star.goals}G ${star.assists}A`
        : star.savePctg !== undefined
        ? `SV% ${(star.savePctg * 100).toFixed(1)}%`
        : '';
      sections.push(`  ${star.star}. ${name(star.name)} (${star.teamAbbrev} ${star.position}) ${statLine}`);
    }
  }

  if (data.summary?.scoring) {
    sections.push(`\nSCORING:`);
    for (const period of data.summary.scoring) {
      sections.push(`  ${period.periodDescriptor?.periodType ?? 'Period'} ${period.periodDescriptor?.number ?? ''}`);
      for (const goal of period.goals) {
        const assists = goal.assists?.map(a => `${name(a.firstName)} ${name(a.lastName)}`).join(', ') ?? 'unassisted';
        sections.push(`    ${goal.timeInPeriod} - ${name(goal.firstName)} ${name(goal.lastName)} (${goal.teamAbbrev}) ${goal.awayScore}-${goal.homeScore} [${assists}] (${goal.strength})`);
      }
    }
  }

  if (data.summary?.penalties && data.summary.penalties.length > 0) {
    sections.push(`\nPENALTIES:`);
    for (const period of data.summary.penalties) {
      if (period.penalties.length === 0) continue;
      sections.push(`  ${period.periodDescriptor?.periodType ?? 'Period'} ${period.periodDescriptor?.number ?? ''}`);
      for (const pen of period.penalties) {
        const player = pen.committedByPlayer ? `${name(pen.committedByPlayer)} ` : '';
        sections.push(`    ${pen.timeInPeriod} - ${player}(${name(pen.teamAbbrev)}) ${pen.duration}min ${pen.descKey}`);
      }
    }
  }

  return sections.join('\n');
}
