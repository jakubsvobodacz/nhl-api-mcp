import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatEdgeSkaterStats } from '../formatters/edge.js';
import { handleError } from '../utils/errors.js';

export function registerEdgeSkaterStatsTool(server: McpServer): void {
  server.tool(
    'get_edge_skater_stats',
    'Get NHL Edge tracking statistics for skaters. Includes advanced metrics like speed, distance, zone time, shot tracking, and more.',
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
        'leaders-realtime',
        'leaders-speed',
      ]).describe('Type of edge tracking report'),
      season: z.string().optional().describe('Season in YYYYYYYY format, e.g., 20242025'),
      game_type: z.number().optional().describe('2=regular season, 3=playoffs'),
      position: z.string().optional().describe('Filter by position: C, L, R, D'),
      team: z.string().optional().describe('Filter by team abbreviation'),
      limit: z.number().optional().default(20).describe('Number of results (default 20)'),
    },
    async ({ report, season, game_type, position, team, limit }) => {
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
          'leaders-realtime': 'getRealtimeLeaders',
          'leaders-speed': 'getSpeedLeaders',
        };

        const skaters = getClient().web.edge.skaters;
        const method = methodMap[report];
        const fn = (skaters[method as keyof typeof skaters] as Function).bind(skaters);

        const edgeParams: any = {};
        if (season) edgeParams.season = season;
        if (game_type !== undefined) edgeParams.gameType = game_type;
        if (position) edgeParams.position = position;
        if (team) edgeParams.team = team;
        if (limit !== undefined) edgeParams.limit = limit;

        const data = await fn(edgeParams);

        return {
          content: [{ type: 'text' as const, text: formatEdgeSkaterStats(data, report) }],
        };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
