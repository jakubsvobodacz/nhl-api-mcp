import { table } from '../utils/helpers.js';

interface FranchiseData {
  data: { id?: number; fullName?: string; teamFullName?: string; teamAbbrev?: string; triCode?: string; firstSeasonId?: number; lastSeasonId?: number; teamCommonName?: string; teamPlaceName?: string; [key: string]: unknown }[];
  total: number;
}

export function formatFranchises(response: FranchiseData): string {
  if (!response.data.length) return 'No franchises found.';

  const lines: string[] = [`NHL Franchises (${response.total} total)\n`];

  const headers = ['ID', 'Name', 'Abbrev', 'First Season', 'Last Season'];
  const rows = response.data.map(f => [
    String(f.id ?? ''),
    f.fullName ?? f.teamFullName ?? '',
    f.teamAbbrev ?? f.triCode ?? '',
    String(f.firstSeasonId ?? ''),
    f.lastSeasonId ? String(f.lastSeasonId) : 'Active',
  ]);

  lines.push(table(headers, rows));
  return lines.join('\n');
}

export function formatTeam(response: FranchiseData): string {
  if (!response.data.length) return 'Team not found.';
  const team = response.data[0];
  const lines: string[] = ['NHL Team\n'];
  lines.push(`ID: ${team.id}`);
  lines.push(`Name: ${team.fullName ?? team.teamFullName ?? ''}`);
  lines.push(`Abbreviation: ${team.teamAbbrev ?? team.triCode ?? ''}`);
  if (team.teamCommonName) lines.push(`Common Name: ${team.teamCommonName}`);
  if (team.teamPlaceName) lines.push(`Place Name: ${team.teamPlaceName}`);
  if (team.firstSeasonId) lines.push(`First Season: ${team.firstSeasonId}`);
  if (team.lastSeasonId) lines.push(`Last Season: ${team.lastSeasonId}`);
  return lines.join('\n');
}
