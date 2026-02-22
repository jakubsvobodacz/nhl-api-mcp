import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerStandingsTool } from './tools/standings.js';
import { registerScoresTool } from './tools/scores.js';
import { registerPlayerTool } from './tools/player.js';
import { registerPlayerGameLogTool } from './tools/player-game-log.js';
import { registerSpotlightPlayersTool } from './tools/spotlight-players.js';
import { registerTeamRosterTool } from './tools/team-roster.js';
import { registerTeamStatsTool } from './tools/team-stats.js';
import { registerTeamProspectsTool } from './tools/team-prospects.js';
import { registerScheduleTool } from './tools/schedule.js';
import { registerGameBoxscoreTool } from './tools/game-boxscore.js';
import { registerGameStoryTool } from './tools/game-story.js';
import { registerPlayByPlayTool } from './tools/play-by-play.js';
import { registerShiftChartsTool } from './tools/shift-charts.js';
import { registerLeadersTool } from './tools/leaders.js';
import { registerDraftTool } from './tools/draft.js';
import { registerPlayoffsTool } from './tools/playoffs.js';
import { registerTvScheduleTool } from './tools/tv-schedule.js';
import { registerEdgeSkaterStatsTool } from './tools/edge-skater-stats.js';
import { registerEdgeTeamStatsTool } from './tools/edge-team-stats.js';
import { registerEdgeGoalieStatsTool } from './tools/edge-goalie-stats.js';
import { registerSkaterStatsTool } from './tools/skater-stats.js';
import { registerGoalieStatsTool } from './tools/goalie-stats.js';
import { registerTeamStatsReportTool } from './tools/team-stats-report.js';
import { registerFranchisesTool } from './tools/franchises.js';
import { registerSearchPlayersTool } from './tools/search-players.js';
import { registerGlossaryTool } from './tools/glossary.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'nhl-api-mcp',
    version: '1.0.0',
  });

  registerStandingsTool(server);
  registerScoresTool(server);
  registerPlayerTool(server);
  registerPlayerGameLogTool(server);
  registerSpotlightPlayersTool(server);
  registerTeamRosterTool(server);
  registerTeamStatsTool(server);
  registerTeamProspectsTool(server);
  registerScheduleTool(server);
  registerGameBoxscoreTool(server);
  registerGameStoryTool(server);
  registerPlayByPlayTool(server);
  registerShiftChartsTool(server);
  registerLeadersTool(server);
  registerDraftTool(server);
  registerPlayoffsTool(server);
  registerTvScheduleTool(server);
  registerEdgeSkaterStatsTool(server);
  registerEdgeTeamStatsTool(server);
  registerEdgeGoalieStatsTool(server);
  registerSkaterStatsTool(server);
  registerGoalieStatsTool(server);
  registerTeamStatsReportTool(server);
  registerFranchisesTool(server);
  registerSearchPlayersTool(server);
  registerGlossaryTool(server);

  return server;
}
