import { LeadersResponse } from 'nhl-api-client';
import { name } from '../utils/helpers.js';

export function formatLeaders(data: LeadersResponse): string {
  const sections: string[] = [];

  for (const category of data.categories) {
    const title = category.displayTitle ?? category.categoryKey;
    const leaders = category.leaders.slice(0, 10).map((l, i) =>
      `${i + 1}. ${name(l.firstName)} ${name(l.lastName)} (${l.teamAbbrev} ${l.position}) - ${l.value}`
    );
    sections.push(`${title}\n${leaders.join('\n')}`);
  }

  return sections.join('\n\n');
}
