import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatPlayByPlay } from '../formatters/play-by-play.js';
import { handleError } from '../utils/errors.js';

export function registerPlayByPlayTool(server: McpServer): void {
  server.tool(
    'get_play_by_play',
    'Get detailed play-by-play events for a game. Default shows goals and penalties. Can filter for shots, hits, faceoffs, blocks.',
    {
      game_id: z.number().describe('Game ID (format: SSSSTTNNNN, e.g., 2024020567)'),
      event_types: z.string().optional().describe('Comma-separated filter: goal,shot,penalty,faceoff,hit,blocked-shot. Omit for goals+penalties only.'),
    },
    async ({ game_id, event_types }) => {
      try {
        const data = await getClient().games.getPlayByPlay(game_id);
        return { content: [{ type: 'text' as const, text: formatPlayByPlay(data, event_types) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
