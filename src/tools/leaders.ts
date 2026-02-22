import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatLeaders } from '../formatters/leaders.js';
import { handleError } from '../utils/errors.js';

export function registerLeadersTool(server: McpServer): void {
  server.tool(
    'get_leaders',
    'Get NHL stat leaders for skaters or goalies. Shows top players by category (goals, assists, points, saves, etc).',
    {
      player_type: z.enum(['skaters', 'goalies']).default('skaters').describe('Type of players: skaters or goalies'),
      categories: z.string().optional().describe('Comma-separated stat categories (e.g., goals,assists,points)'),
      season: z.string().optional().describe('Season in YYYYYYYY format. Omit for current season.'),
      game_type: z.number().optional().default(2).describe('Game type: 2=Regular season, 3=Playoffs. Default is 2.'),
    },
    async ({ player_type, categories, season, game_type }) => {
      try {
        const data = season
          ? player_type === 'goalies'
            ? await getClient().leaders.getGoalies(season, game_type, categories)
            : await getClient().leaders.getSkaters(season, game_type, categories)
          : player_type === 'goalies'
          ? await getClient().leaders.getGoaliesCurrent(categories)
          : await getClient().leaders.getSkatersCurrent(categories);
        return { content: [{ type: 'text' as const, text: formatLeaders(data) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
