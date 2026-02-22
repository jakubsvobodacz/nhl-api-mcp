import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatPlayoffs } from '../formatters/playoffs.js';
import { handleError } from '../utils/errors.js';

export function registerPlayoffsTool(server: McpServer): void {
  server.tool(
    'get_playoffs',
    'Get NHL playoff information: bracket, series carousel, or series schedule.',
    {
      type: z.enum(['bracket', 'series', 'schedule']).default('bracket').describe('Type: bracket, series, or schedule'),
      season: z.string().optional().describe('Season in YYYYYYYY format. Omit for current playoffs.'),
      series_letter: z.string().optional().describe('Required for schedule type. Series letter (e.g., A, B, C...)'),
    },
    async ({ type, season, series_letter }) => {
      try {
        let data: any;
        if (type === 'bracket') {
          data = await getClient().playoffs.getBracket(season);
        } else if (type === 'series') {
          data = await getClient().playoffs.getSeriesCarousel(season);
        } else {
          if (!series_letter) {
            return {
              content: [{ type: 'text' as const, text: 'Error: series_letter is required for schedule type.' }],
              isError: true,
            };
          }
          data = await getClient().playoffs.getSeriesSchedule(season ?? '', series_letter);
        }
        return { content: [{ type: 'text' as const, text: formatPlayoffs(data, type) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
