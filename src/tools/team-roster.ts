import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatRoster } from '../formatters/roster.js';
import { handleError } from '../utils/errors.js';

export function registerTeamRosterTool(server: McpServer): void {
  server.tool(
    'get_team_roster',
    'Get full team roster with player details grouped by position (forwards, defensemen, goalies).',
    {
      team: z.string().describe('Team abbreviation (e.g., TOR, EDM, NYR)'),
      season: z.string().optional().describe('Season in YYYYYYYY format. Omit for current season.'),
    },
    async ({ team, season }) => {
      try {
        const data = await getClient().teams.getRoster(team, season);
        return { content: [{ type: 'text' as const, text: formatRoster(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
