import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatShiftCharts } from '../formatters/shift-charts.js';
import { handleError } from '../utils/errors.js';

export function registerShiftChartsTool(server: McpServer): void {
  server.tool(
    'get_shift_charts',
    'Get shift charts for a specific game. Shows individual player shift data including time on ice, period, and event descriptions.',
    {
      game_id: z.number().describe('Game ID (format: SSSSTTNNNN, e.g., 2024020567)'),
      team: z.string().optional().describe('Filter by team abbreviation'),
      player_id: z.number().optional().describe('Filter by player ID'),
    },
    async ({ game_id, team, player_id }) => {
      try {
        let shifts = await getClient().stats.games.getShiftCharts(game_id);

        if (team) {
          shifts = shifts.filter(s => s.teamAbbrev === team || s.teamName === team);
        }

        if (player_id) {
          shifts = shifts.filter(s => s.playerId === player_id);
        }

        return {
          content: [{ type: 'text' as const, text: formatShiftCharts(shifts) }],
        };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
