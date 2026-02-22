import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatGameStory } from '../formatters/game-story.js';
import { handleError } from '../utils/errors.js';

export function registerGameStoryTool(server: McpServer): void {
  server.tool(
    'get_game_story',
    'Get game recap with three stars, goal-by-goal summary, and penalties.',
    { game_id: z.number().describe('Game ID (format: SSSSTTNNNN, e.g., 2024020567)') },
    async ({ game_id }) => {
      try {
        const data = await getClient().games.getLanding(game_id);
        return { content: [{ type: 'text' as const, text: formatGameStory(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
