import { Boxscore } from 'nhl-api-client';
import { name, table, pctg } from '../utils/helpers.js';

export function formatBoxscore(data: Boxscore): string {
  const sections: string[] = [];

  const scoreLine = `${name(data.awayTeam.name)} ${data.awayTeam.score} - ${data.homeTeam.score} ${name(data.homeTeam.name)}`;
  sections.push(scoreLine);

  if (data.boxscore?.linescore) {
    const periods = data.boxscore.linescore.byPeriod?.map(p => `P${p.period}: ${p.away}-${p.home}`).join(', ') ?? '';
    if (periods) sections.push(periods);
  }

  const stats = [
    ['Stat', name(data.awayTeam.abbrev), name(data.homeTeam.abbrev)],
    ['SOG', String(data.awayTeam.sog), String(data.homeTeam.sog)],
    ['Faceoffs', pctg(data.awayTeam.faceoffWinningPctg), pctg(data.homeTeam.faceoffWinningPctg)],
    ['PP', `${data.awayTeam.powerPlay ?? '0/0'}`, `${data.homeTeam.powerPlay ?? '0/0'}`],
    ['PIM', String(data.awayTeam.pim), String(data.homeTeam.pim)],
    ['Hits', String(data.awayTeam.hits), String(data.homeTeam.hits)],
    ['Blocks', String(data.awayTeam.blocks), String(data.homeTeam.blocks)],
  ];
  sections.push(table(stats[0], stats.slice(1)));

  if (data.playerByGameStats) {
    const awayTop = data.playerByGameStats.awayTeam?.forwards?.slice(0, 3) ?? [];
    const homeTop = data.playerByGameStats.homeTeam?.forwards?.slice(0, 3) ?? [];
    if (awayTop.length > 0 || homeTop.length > 0) {
      sections.push(`\nTop Performers:`);
      const topRows = [...awayTop, ...homeTop].map(p => [
        `${name(p.name)} (${name(data.awayTeam.abbrev)})`,
        `${p.goals}G ${p.assists}A ${p.points}PTS`,
      ]);
      sections.push(topRows.map(r => `  ${r[0]}: ${r[1]}`).join('\n'));
    }
  }

  return sections.join('\n\n');
}
