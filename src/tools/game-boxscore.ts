import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatBoxscore } from '../formatters/boxscore.js';
import { handleError } from '../utils/errors.js';

export function registerGameBoxscoreTool(server: McpServer): void {
  server.tool(
    'get_game_boxscore',
    'Get detailed game boxscore with period breakdown, team stats, and player stats.',
    { game_id: z.number().describe('Game ID (format: SSSSTTNNNN, e.g., 2024020567)') },
    async ({ game_id }) => {
      try {
        const data = await getClient().games.getBoxscore(game_id);
        return { content: [{ type: 'text' as const, text: formatBoxscore(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
