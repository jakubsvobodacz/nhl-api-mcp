import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatProspects } from '../formatters/prospects.js';
import { handleError } from '../utils/errors.js';

export function registerTeamProspectsTool(server: McpServer): void {
  server.tool(
    'get_team_prospects',
    'Get team prospect statistics and information.',
    { team: z.string().describe('Team abbreviation (e.g., TOR, EDM, NYR)') },
    async ({ team }) => {
      try {
        const data = await getClient().teams.getProspects(team);
        return { content: [{ type: 'text' as const, text: formatProspects(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
