import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatSchedule } from '../formatters/schedule.js';
import { handleError } from '../utils/errors.js';

export function registerScheduleTool(server: McpServer): void {
  server.tool(
    'get_schedule',
    'Get NHL schedule for a date or team. Shows game times, venues, and TV broadcasts.',
    {
      date: z.string().optional().describe('Date in YYYY-MM-DD format. Omit for today.'),
      team: z.string().optional().describe('Team abbreviation to filter by specific team.'),
    },
    async ({ date, team }) => {
      try {
        const data = team
          ? await getClient().schedule.getByTeam(team, date)
          : await getClient().schedule.get(date);
        return { content: [{ type: 'text' as const, text: formatSchedule(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
