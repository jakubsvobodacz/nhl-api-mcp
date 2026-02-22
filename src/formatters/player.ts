import { PlayerLanding } from 'nhl-api-client';
import { name } from '../utils/helpers.js';

export function formatPlayer(data: PlayerLanding): string {
  const fullName = `${name(data.firstName)} ${name(data.lastName)}`;
  const bio = [
    `${fullName} #${data.sweaterNumber}`,
    `${data.currentTeamAbbrev} | ${data.position}`,
    `Height: ${Math.floor((data.heightInInches ?? 0) / 12)}'${(data.heightInInches ?? 0) % 12}" | Weight: ${data.weightInPounds} lbs`,
    `Born: ${data.birthDate} in ${name(data.birthCity)}, ${data.birthCountry}`,
    `${data.shootsCatches === 'L' ? 'Shoots/Catches: Left' : 'Shoots/Catches: Right'}`,
  ];

  if (data.draftDetails) {
    bio.push(`Draft: ${data.draftDetails.year} Round ${data.draftDetails.round}, Pick ${data.draftDetails.pickInRound} by ${data.draftDetails.teamAbbrev}`);
  }

  const sections = [bio.join('\n')];

  if (data.featuredStats?.regularSeason?.subSeason) {
    const stats = data.featuredStats.regularSeason.subSeason;
    sections.push(`\nCurrent Season Stats:\nGP: ${stats.gamesPlayed} | G: ${stats.goals} | A: ${stats.assists} | PTS: ${stats.points} | +/-: ${stats.plusMinus}`);
  }

  if (data.careerTotals?.regularSeason) {
    const career = data.careerTotals.regularSeason;
    sections.push(`\nCareer Totals:\nGP: ${career.gamesPlayed} | G: ${career.goals} | A: ${career.assists} | PTS: ${career.points}`);
  }

  return sections.join('\n');
}
