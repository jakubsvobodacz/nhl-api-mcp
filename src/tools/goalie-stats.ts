import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CayenneExpBuilder } from 'nhl-api-client';
import { getClient } from '../client.js';
import { formatGoalieStats, formatMilestones } from '../formatters/stats-api.js';
import { handleError } from '../utils/errors.js';

export function registerGoalieStatsTool(server: McpServer): void {
  server.tool(
    'get_goalie_stats',
    'Get goalie statistics from the NHL Stats API. Query by report type, leaders, or milestones. Supports advanced filtering via cayenneExp.',
    {
      type: z.enum(['report', 'leaders', 'milestones']).default('report').describe('Type of query: report=stats by report type, leaders=stat leaders, milestones=milestone tracking'),
      report: z.string().default('summary').describe('Report type: summary, advanced, bios, daysrest, penaltyshots, savesByStrength, shootout, startedVsRelieved'),
      season: z.string().optional().describe('Season in YYYYYYYY format'),
      game_type: z.number().optional().default(2).describe('2=regular season, 3=playoffs'),
      team: z.string().optional().describe('Team abbreviation'),
      min_games: z.number().optional().describe('Minimum games played filter'),
      sort: z.string().optional().describe('Sort field (e.g., wins, savePct, goalsAgainstAverage)'),
      dir: z.enum(['ASC', 'DESC']).optional().default('DESC'),
      limit: z.number().optional().default(25),
      cayenne_exp: z.string().optional().describe('Raw cayenneExp override for advanced queries'),
    },
    async (args) => {
      try {
        let cayenneExp = args.cayenne_exp;

        if (!cayenneExp) {
          const builder = new CayenneExpBuilder();
          if (args.season) builder.seasonId(args.season);
          builder.gameTypeId(args.game_type ?? 2);
          if (args.min_games) builder.gamesPlayed('>=', args.min_games);
          if (args.team) {
            builder.raw(`teamAbbrevs="${args.team}"`);
          }
          cayenneExp = builder.build();
        }

        const query = {
          cayenneExp,
          sort: args.sort,
          dir: args.dir,
          limit: args.limit,
        };

        let data;
        let formattedText;

        if (args.type === 'report') {
          data = await getClient().stats.goalies.getByReport(args.report, query);
          formattedText = formatGoalieStats(data, args.report);
        } else if (args.type === 'leaders') {
          data = await getClient().stats.goalies.getLeaders(args.report, query);
          formattedText = formatGoalieStats(data, args.report);
        } else {
          data = await getClient().stats.goalies.getMilestones(query);
          formattedText = formatMilestones(data);
        }

        return {
          content: [{ type: 'text' as const, text: formattedText }],
        };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
