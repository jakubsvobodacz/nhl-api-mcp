interface MetaData {
  players: { playerId: number; name: string; teamId: number; teamAbbrev: string; position: string }[];
  teams: { teamId: number; teamAbbrev: string; teamFullName: string }[];
}

export function formatSearchPlayers(data: MetaData, query: string): string {
  const q = query.toLowerCase();
  const matchedPlayers = data.players.filter(p =>
    p.name.toLowerCase().includes(q) || p.teamAbbrev?.toLowerCase().includes(q)
  );
  const matchedTeams = data.teams.filter(t =>
    t.teamAbbrev.toLowerCase().includes(q) || t.teamFullName.toLowerCase().includes(q)
  );

  const sections: string[] = [];

  if (matchedPlayers.length > 0) {
    sections.push(`PLAYERS (${matchedPlayers.length} matches):`);
    matchedPlayers.slice(0, 20).forEach(p => {
      sections.push(`  ${p.name} - ${p.teamAbbrev ?? 'N/A'} ${p.position} (ID: ${p.playerId})`);
    });
    if (matchedPlayers.length > 20) {
      sections.push(`  ... and ${matchedPlayers.length - 20} more`);
    }
  }

  if (matchedTeams.length > 0) {
    sections.push(`\nTEAMS (${matchedTeams.length} matches):`);
    matchedTeams.forEach(t => {
      sections.push(`  ${t.teamFullName} (${t.teamAbbrev}) - ID: ${t.teamId}`);
    });
  }

  if (sections.length === 0) {
    return `No players or teams found matching "${query}".`;
  }

  return sections.join('\n');
}
