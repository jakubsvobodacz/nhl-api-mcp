import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatGameLog } from '../formatters/game-log.js';
import { handleError } from '../utils/errors.js';

export function registerPlayerGameLogTool(server: McpServer): void {
  server.tool(
    'get_player_game_log',
    'Get game-by-game stats for a player. Shows goals, assists, points, +/-, shots, TOI for skaters. Shows decisions, saves, SV%, shutouts for goalies.',
    {
      player_id: z.number().describe('Player ID. Use search_players to find IDs.'),
      season: z.string().optional().describe('Season in YYYYYYYY format (e.g., 20232024). Omit for current season.'),
      game_type: z.number().optional().default(2).describe('Game type: 2=Regular season, 3=Playoffs. Default is 2.'),
    },
    async ({ player_id, season, game_type }) => {
      try {
        const data = season
          ? await getClient().players.getGameLog(player_id, season, game_type)
          : await getClient().players.getGameLogNow(player_id);
        return { content: [{ type: 'text' as const, text: formatGameLog(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
