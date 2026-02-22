import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getClient } from '../client.js';
import { formatSpotlight } from '../formatters/spotlight.js';
import { handleError } from '../utils/errors.js';

export function registerSpotlightPlayersTool(server: McpServer): void {
  server.tool(
    'get_spotlight_players',
    'Get list of featured/spotlight NHL players.',
    {},
    async () => {
      try {
        const data = await getClient().players.getSpotlight();
        return { content: [{ type: 'text' as const, text: formatSpotlight(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
