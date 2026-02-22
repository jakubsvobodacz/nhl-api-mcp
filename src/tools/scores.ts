import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatScores } from '../formatters/scores.js';
import { handleError } from '../utils/errors.js';

export function registerScoresTool(server: McpServer): void {
  server.tool(
    'get_scores',
    'Get NHL game scores for a specific date or today. Shows final scores, live game status, or scheduled start times.',
    { date: z.string().optional().describe('Date in YYYY-MM-DD format. Omit for today.') },
    async ({ date }) => {
      try {
        const data = await getClient().scores.get(date);
        return { content: [{ type: 'text' as const, text: formatScores(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
