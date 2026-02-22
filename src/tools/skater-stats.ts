import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CayenneExpBuilder } from 'nhl-api-client';
import { getClient } from '../client.js';
import { formatSkaterStats, formatMilestones } from '../formatters/stats-api.js';
import { handleError } from '../utils/errors.js';
import { validateTeamAbbrev, validateCayenneExp } from '../utils/helpers.js';

export function registerSkaterStatsTool(server: McpServer): void {
  server.tool(
    'get_skater_stats',
    'Get skater statistics from the NHL Stats API. Query by report type, leaders, or milestones. Supports advanced filtering via cayenneExp.',
    {
      type: z.enum(['report', 'leaders', 'milestones']).default('report').describe('Type of query: report=stats by report type, leaders=stat leaders, milestones=milestone tracking'),
      report: z.string().default('summary').describe('Report type: summary, bios, faceoffpercentages, faceoffwinslosses, goalsforagainst, realtime, penalties, penaltykill, penaltyshots, powerplay, puckpossessions, summaryshooting, percentages, scoringRates, shootout, shottype, timeonice'),
      season: z.string().optional().describe('Season in YYYYYYYY format'),
      game_type: z.number().optional().default(2).describe('2=regular season, 3=playoffs'),
      position: z.string().optional().describe('Position filter: C, L, R, D, or combinations like C,L,R for forwards'),
      team: z.string().optional().describe('Team abbreviation'),
      min_games: z.number().optional().describe('Minimum games played filter'),
      sort: z.string().optional().describe('Sort field (e.g., points, goals, assists)'),
      dir: z.enum(['ASC', 'DESC']).optional().default('DESC'),
      limit: z.number().optional().default(25),
      cayenne_exp: z.string().optional().describe('Raw cayenneExp override for advanced queries'),
    },
    async (args) => {
      try {
        let cayenneExp = args.cayenne_exp
          ? validateCayenneExp(args.cayenne_exp)
          : undefined;

        if (!cayenneExp) {
          const builder = new CayenneExpBuilder();
          if (args.season) builder.seasonId(args.season);
          builder.gameTypeId(args.game_type ?? 2);
          if (args.position) builder.position(args.position);
          if (args.min_games) builder.gamesPlayed('>=', args.min_games);
          if (args.team) {
            const team = validateTeamAbbrev(args.team);
            builder.raw(`teamAbbrevs="${team}"`);
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
          data = await getClient().stats.skaters.getByReport(args.report, query);
          formattedText = formatSkaterStats(data, args.report);
        } else if (args.type === 'leaders') {
          data = await getClient().stats.skaters.getLeaders(args.report, query);
          formattedText = formatSkaterStats(data, args.report);
        } else {
          data = await getClient().stats.skaters.getMilestones(query);
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
