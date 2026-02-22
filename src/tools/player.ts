import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatPlayer } from '../formatters/player.js';
import { handleError } from '../utils/errors.js';

export function registerPlayerTool(server: McpServer): void {
  server.tool(
    'get_player',
    'Get detailed player information including bio, current season stats, and career totals. Use search_players to find player IDs.',
    { player_id: z.number().describe('Player ID. Use search_players to find IDs.') },
    async ({ player_id }) => {
      try {
        const data = await getClient().players.getLanding(player_id);
        return { content: [{ type: 'text' as const, text: formatPlayer(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
