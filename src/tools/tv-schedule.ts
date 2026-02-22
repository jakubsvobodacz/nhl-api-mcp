import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatTvSchedule } from '../formatters/tv-schedule.js';
import { handleError } from '../utils/errors.js';

export function registerTvScheduleTool(server: McpServer): void {
  server.tool(
    'get_tv_schedule',
    'Get TV broadcast schedule for NHL games. Shows networks and markets broadcasting each game.',
    { date: z.string().optional().describe('Date in YYYY-MM-DD format. Omit for today.') },
    async ({ date }) => {
      try {
        const data = await getClient().network.getTvSchedule(date);
        return { content: [{ type: 'text' as const, text: formatTvSchedule(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
