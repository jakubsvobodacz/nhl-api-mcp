import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatEdgeTeamStats } from '../formatters/edge.js';
import { handleError } from '../utils/errors.js';

export function registerEdgeTeamStatsTool(server: McpServer): void {
  server.tool(
    'get_edge_team_stats',
    'Get NHL Edge tracking statistics for teams. Includes advanced metrics like speed, distance, zone time, shot tracking, and more.',
    {
      report: z.enum([
        'real-time',
        'distance',
        'speed',
        'speed-bursts',
        'zone-time',
        'shot-speed',
        'shot-location',
        'time-between-shots',
        'possession-time',
        'penalty-kill',
        'power-play',
        'faceoffs',
        'overview',
      ]).describe('Type of edge tracking report'),
      season: z.string().optional().describe('Season in YYYYYYYY format, e.g., 20242025'),
      game_type: z.number().optional().describe('2=regular season, 3=playoffs'),
      limit: z.number().optional().default(20).describe('Number of results (default 20)'),
    },
    async ({ report, season, game_type, limit }) => {
      try {
        const methodMap: Record<string, string> = {
          'real-time': 'getRealTimeStats',
          'distance': 'getDistance',
          'speed': 'getSpeed',
          'speed-bursts': 'getSpeedBursts',
          'zone-time': 'getZoneTime',
          'shot-speed': 'getShotSpeed',
          'shot-location': 'getShotLocation',
          'time-between-shots': 'getTimeBetweenShots',
          'possession-time': 'getPossessionTime',
          'penalty-kill': 'getPenaltyKill',
          'power-play': 'getPowerPlay',
          'faceoffs': 'getFaceoffs',
          'overview': 'getOverview',
        };

        const teams = getClient().web.edge.teams;
        const method = methodMap[report];
        const fn = (teams[method as keyof typeof teams] as Function).bind(teams);

        const edgeParams: any = {};
        if (season) edgeParams.season = season;
        if (game_type !== undefined) edgeParams.gameType = game_type;
        if (limit !== undefined) edgeParams.limit = limit;

        const data = await fn(edgeParams);

        return {
          content: [{ type: 'text' as const, text: formatEdgeTeamStats(data, report) }],
        };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
