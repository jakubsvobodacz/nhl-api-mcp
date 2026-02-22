import { TeamRoster } from 'nhl-api-client';
import { name, table } from '../utils/helpers.js';

export function formatRoster(data: TeamRoster): string {
  const sections: string[] = [];

  const formatGroup = (title: string, players: typeof data.forwards) => {
    if (players.length === 0) return '';
    const rows = players.map(p => [
      p.sweaterNumber,
      `${name(p.firstName)} ${name(p.lastName)}`,
      p.positionCode,
      p.shootsCatches,
      `${Math.floor((p.heightInInches ?? 0) / 12)}'${(p.heightInInches ?? 0) % 12}"`,
      `${p.weightInPounds} lbs`,
      `${p.birthDate} (${p.birthCountry})`,
    ]);
    return `${title}\n${table(['#', 'Name', 'Pos', 'S/C', 'Height', 'Weight', 'Born'], rows)}`;
  };

  const fwd = formatGroup('FORWARDS', data.forwards);
  const def = formatGroup('DEFENSEMEN', data.defensemen);
  const goa = formatGroup('GOALIES', data.goalies);

  if (fwd) sections.push(fwd);
  if (def) sections.push(def);
  if (goa) sections.push(goa);

  return sections.join('\n\n');
}
