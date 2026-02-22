import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatStandings } from '../formatters/standings.js';
import { handleError } from '../utils/errors.js';

export function registerStandingsTool(server: McpServer): void {
  server.tool(
    'get_standings',
    'Get current NHL standings by division. Shows W, L, OTL, PTS, goal differential, streak, and last 10 record.',
    { date: z.string().optional().describe('Date in YYYY-MM-DD format. Omit for current standings.') },
    async ({ date }) => {
      try {
        const data = await getClient().standings.get(date);
        return { content: [{ type: 'text' as const, text: formatStandings(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
