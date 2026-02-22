import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatSearchPlayers } from '../formatters/search-players.js';
import { handleError } from '../utils/errors.js';

export function registerSearchPlayersTool(server: McpServer): void {
  server.tool(
    'search_players',
    'Search for players and teams by name or abbreviation. Returns player IDs needed for other tools.',
    { query: z.string().describe('Player name or team abbreviation to search for') },
    async ({ query }) => {
      try {
        const data = await getClient().meta.get();
        return { content: [{ type: 'text' as const, text: formatSearchPlayers(data, query) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
