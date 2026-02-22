import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CayenneExpBuilder } from 'nhl-api-client';
import { getClient } from '../client.js';
import { formatTeamStatsReport } from '../formatters/stats-api.js';
import { handleError } from '../utils/errors.js';

export function registerTeamStatsReportTool(server: McpServer): void {
  server.tool(
    'get_team_stats_report',
    'Get team statistics by report type from the NHL Stats API. Includes summary stats, penalties, powerplay, shooting, and more. Supports advanced filtering via cayenneExp.',
    {
      report: z.string().default('summary').describe('Report type: summary, penalties, penaltykill, penaltykilltime, powerplay, powerplaytime, summaryshooting, faceoffpercentages, daysrest, outshootoutshot, realtime, shootout, scoring, shottype'),
      season: z.string().optional().describe('Season in YYYYYYYY format'),
      game_type: z.number().optional().default(2).describe('2=regular season, 3=playoffs'),
      sort: z.string().optional().describe('Sort field (e.g., points, wins, goalDifferential)'),
      dir: z.enum(['ASC', 'DESC']).optional().default('DESC'),
      limit: z.number().optional().default(32),
      cayenne_exp: z.string().optional().describe('Raw cayenneExp override for advanced queries'),
    },
    async (args) => {
      try {
        let cayenneExp = args.cayenne_exp;

        if (!cayenneExp) {
          const builder = new CayenneExpBuilder();
          if (args.season) builder.seasonId(args.season);
          builder.gameTypeId(args.game_type ?? 2);
          cayenneExp = builder.build();
        }

        const query = {
          cayenneExp,
          sort: args.sort,
          dir: args.dir,
          limit: args.limit,
        };

        const data = await getClient().stats.teams.getByReport(args.report, query);

        return {
          content: [{ type: 'text' as const, text: formatTeamStatsReport(data, args.report) }],
        };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
