import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerStandingsTool } from './tools/standings.js';
import { registerScoresTool } from './tools/scores.js';
import { registerPlayerTool } from './tools/player.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'nhl-api-mcp',
    version: '1.0.0',
  });

  registerStandingsTool(server);
  registerScoresTool(server);
  registerPlayerTool(server);

  return server;
}
