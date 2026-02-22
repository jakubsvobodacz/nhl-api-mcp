import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';
import { formatGlossary } from '../formatters/glossary.js';
import { handleError } from '../utils/errors.js';

export function registerGlossaryTool(server: McpServer): void {
  server.tool(
    'get_glossary',
    'Get NHL statistics glossary. Explains abbreviations and terminology used in stats.',
    { term: z.string().optional().describe('Search for specific term or abbreviation') },
    async ({ term }) => {
      try {
        const data = await getClient().stats.misc.getGlossary();
        return { content: [{ type: 'text' as const, text: formatGlossary(data, term) }] };
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
