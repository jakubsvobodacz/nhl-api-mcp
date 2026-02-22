import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatEdgeGoalieStats } from '../formatters/edge.js';
import { handleError } from '../utils/errors.js';

export function registerEdgeGoalieStatsTool(server: McpServer): void {
  server.tool(
    'get_edge_goalie_stats',
    'Get NHL Edge tracking statistics for goalies. Includes advanced metrics like save tracking, shot speed, shot location, zone time, and more.',
    {
      report: z.enum([
        'real-time',
        'save-tracking',
        'shot-speed',
        'shot-location',
        'shot-type',
        'zone-time',
        'penalty-kill',
        'start-vs-relief',
        'days-rest',
        'overview',
        'leaders',
      ]).describe('Type of edge tracking report'),
      season: z.string().optional().describe('Season in YYYYYYYY format, e.g., 20242025'),
      game_type: z.number().optional().describe('2=regular season, 3=playoffs'),
      team: z.string().optional().describe('Filter by team abbreviation'),
      limit: z.number().optional().default(20).describe('Number of results (default 20)'),
    },
    async ({ report, season, game_type, team, limit }) => {
      try {
        const methodMap: Record<string, string> = {
          'real-time': 'getRealTimeStats',
          'save-tracking': 'getSaveTracking',
          'shot-speed': 'getShotSpeed',
          'shot-location': 'getShotLocation',
          'shot-type': 'getShotType',
          'zone-time': 'getZoneTime',
          'penalty-kill': 'getPenaltyKill',
          'start-vs-relief': 'getStartVsRelief',
          'days-rest': 'getDaysRest',
          'overview': 'getOverview',
          'leaders': 'getLeaders',
        };

        const goalies = getClient().web.edge.goalies;
        const method = methodMap[report];
        const fn = (goalies[method as keyof typeof goalies] as Function).bind(goalies);

        const edgeParams: any = {};
        if (season) edgeParams.season = season;
        if (game_type !== undefined) edgeParams.gameType = game_type;
        if (team) edgeParams.team = team;
        if (limit !== undefined) edgeParams.limit = limit;

        const data = await fn(edgeParams);

        return {
          content: [{ type: 'text' as const, text: formatEdgeGoalieStats(data, report) }],
        };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
