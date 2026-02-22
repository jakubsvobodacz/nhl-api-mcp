import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatFranchises, formatTeam } from '../formatters/franchises.js';
import { handleError } from '../utils/errors.js';

export function registerFranchisesTool(server: McpServer): void {
  server.tool(
    'get_franchises',
    'Get NHL franchise and team information. Query all franchises, all teams, or a specific team by ID.',
    {
      type: z.enum(['franchises', 'all', 'by-id']).default('franchises').describe('Type of query: franchises=all franchises, all=all teams, by-id=specific team'),
      team_id: z.number().optional().describe('Team ID (required when type=by-id)'),
    },
    async ({ type, team_id }) => {
      try {
        if (type === 'by-id') {
          if (!team_id) {
            throw new Error('team_id is required when type=by-id');
          }
          const data = await getClient().stats.teams.getById(team_id);
          return { content: [{ type: 'text' as const, text: formatTeam(data) }] };
        } else if (type === 'all') {
          const data = await getClient().stats.teams.getAll();
          return { content: [{ type: 'text' as const, text: formatFranchises(data) }] };
        } else {
          const data = await getClient().stats.teams.getFranchises();
          return { content: [{ type: 'text' as const, text: formatFranchises(data) }] };
        }
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
