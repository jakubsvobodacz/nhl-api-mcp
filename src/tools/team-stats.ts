import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatTeamStats } from '../formatters/team-stats.js';
import { handleError } from '../utils/errors.js';

export function registerTeamStatsTool(server: McpServer): void {
  server.tool(
    'get_team_stats',
    'Get team player statistics for a season. Shows skaters (sorted by points) and goalies (sorted by wins).',
    {
      team: z.string().describe('Team abbreviation (e.g., TOR, EDM, NYR)'),
      season: z.string().optional().describe('Season in YYYYYYYY format. Omit for current season.'),
      game_type: z.number().optional().default(2).describe('Game type: 2=Regular season, 3=Playoffs. Default is 2.'),
    },
    async ({ team, season, game_type }) => {
      try {
        const data = await getClient().teams.getStats(team, season, game_type);
        return { content: [{ type: 'text' as const, text: formatTeamStats(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
