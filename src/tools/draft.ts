import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatDraft } from '../formatters/draft.js';
import { handleError } from '../utils/errors.js';

export function registerDraftTool(server: McpServer): void {
  server.tool(
    'get_draft',
    'Get NHL draft rankings or picks. Rankings show prospect rankings by category. Picks show actual draft selections.',
    {
      type: z.enum(['rankings', 'picks']).default('rankings').describe('Type: rankings or picks'),
      season: z.string().optional().describe('Season in YYYYYYYY format. Omit for current year.'),
      round: z.number().optional().describe('For picks: filter by round number (1-7)'),
      prospect_category: z.string().optional().describe('For rankings: prospect category filter'),
    },
    async ({ type, season, round, prospect_category }) => {
      try {
        const data = type === 'rankings'
          ? season
            ? await getClient().draft.getRankings(season, prospect_category)
            : await getClient().draft.getRankingsNow()
          : season
          ? await getClient().draft.getPicks(season, round)
          : await getClient().draft.getPicksNow();
        return { content: [{ type: 'text' as const, text: formatDraft(data, type) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
