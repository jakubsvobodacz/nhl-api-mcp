# nhl-api-mcp

MCP server for NHL statistics. Lets AI assistants answer hockey questions
using real-time data from the NHL Web API and Stats API.

Powered by [nhl-api-client](https://github.com/jakubsvobodacz/nhl-api-client).

## Features

- 26 tools covering standings, scores, players, teams, games, schedule,
  draft, playoffs, NHL Edge analytics, Stats API, and more
- Human-readable formatted responses optimized for AI consumption
- Real-time data from both NHL APIs

## Quick Start

### Prerequisites

- Node.js 18+

### Build from Source

```bash
git clone https://github.com/jakubsvobodacz/nhl-api-mcp.git
cd nhl-api-mcp
npm install
npm run build
```

## Setup by Tool

### Claude Code

Add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "nhl": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/nhl-api-mcp/dist/index.js"]
    }
  }
}
```

Restart Claude Code. Verify with `/mcp` — you should see 26 tools listed.

### Cursor

Settings → MCP → Add Server:

- Name: `nhl`
- Transport: `stdio`
- Command: `node /absolute/path/to/nhl-api-mcp/dist/index.js`

### VS Code (Continue)

Add to `.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "nhl",
      "command": "node",
      "args": ["/absolute/path/to/nhl-api-mcp/dist/index.js"]
    }
  ]
}
```

### VS Code (Cline)

Open Cline MCP settings and add:

```json
{
  "nhl": {
    "command": "node",
    "args": ["/absolute/path/to/nhl-api-mcp/dist/index.js"]
  }
}
```

### Windsurf

Settings → MCP → Add Server with stdio transport pointing to `dist/index.js`.

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nhl": {
      "command": "node",
      "args": ["/absolute/path/to/nhl-api-mcp/dist/index.js"]
    }
  }
}
```

## Example Questions

- "What are the current NHL standings?"
- "Who won last night's games?"
- "Show me Connor McDavid's stats this season" (player ID: 8478402)
- "What's the Maple Leafs' roster?"
- "When is the next Rangers game?"
- "Who leads the league in goals?"
- "Show me the playoff bracket"
- "What are the fastest skaters in the NHL?"
- "Get me the boxscore for game 2024020567"
- "Who are the spotlight players right now?"
- "Show me the Oilers' prospects"
- "What games are on TV tonight?"
- "Show me all skaters with 30+ goals this season"
- "Who are the top goalie leaders?"
- "Explain what GAA means"

## Available Tools

| Tool | Description | Key Params |
|------|-------------|------------|
| `get_standings` | NHL standings by division | `date?` |
| `get_scores` | Game scores for a date | `date?` |
| `get_player` | Full player profile | `player_id` |
| `get_player_game_log` | Game-by-game stats | `player_id`, `season?`, `game_type?` |
| `get_spotlight_players` | Featured/trending players | — |
| `get_team_roster` | Team roster by position | `team`, `season?` |
| `get_team_stats` | Team player statistics | `team`, `season?`, `game_type?` |
| `get_team_prospects` | Team prospect pool | `team` |
| `get_schedule` | Game schedule | `date?`, `team?` |
| `get_game_boxscore` | Full game boxscore | `game_id` |
| `get_game_story` | Three stars, goals, penalties | `game_id` |
| `get_play_by_play` | Play-by-play event feed | `game_id`, `event_types?` |
| `get_shift_charts` | Player shift data | `game_id`, `team?`, `player_id?` |
| `get_leaders` | League stat leaders | `player_type?`, `categories?`, `season?` |
| `get_draft` | Draft rankings or picks | `type?`, `season?`, `round?` |
| `get_playoffs` | Playoff bracket/series | `type?`, `season?`, `series_letter?` |
| `get_tv_schedule` | TV broadcast schedule | `date?` |
| `get_edge_skater_stats` | NHL Edge skater tracking | `report`, `season?`, `team?`, `position?` |
| `get_edge_team_stats` | NHL Edge team tracking | `report`, `season?` |
| `get_edge_goalie_stats` | NHL Edge goalie tracking | `report`, `season?`, `team?` |
| `get_skater_stats` | Stats API skater stats | `report?`, `type?`, `season?`, `min_games?` |
| `get_goalie_stats` | Stats API goalie stats | `report?`, `type?`, `season?` |
| `get_team_stats_report` | Stats API team stats | `report?`, `season?` |
| `get_franchises` | Franchise/team info | `type?`, `team_id?` |
| `search_players` | Player/team ID lookup | `query` |
| `get_glossary` | Stats abbreviation glossary | — |

## Common Parameters

- **Team abbreviations**: `TOR`, `EDM`, `NYR`, `BOS`, `COL`, `FLA`, `VGK`, `DAL`, `CAR`, `WPG`, etc.
- **Season format**: `20242025` (8-digit, start year + end year)
- **Game ID format**: `SSSSTTNNNN` (e.g., `2024020567` — season 2024, type 02=regular, game 0567)
- **Game type**: `2` = regular season, `3` = playoffs
- **Edge reports**: `real-time`, `distance`, `speed`, `speed-bursts`, `zone-time`, `shot-speed`, `shot-location`, `time-between-shots`, `possession-time`, `penalty-kill`, `power-play`, `faceoffs`, `overview`
- **Skater stat reports**: `summary`, `bios`, `faceoffpercentages`, `goalsforagainst`, `realtime`, `penalties`, `penaltykill`, `powerplay`, `timeonice`
- **Goalie stat reports**: `summary`, `advanced`, `bios`, `daysrest`, `savesByStrength`, `startedVsRelieved`

## Development

```bash
npm install       # Install dependencies
npm run build     # Build with tsup (ESM + shebang)
npm run dev       # Run with tsx (hot reload)
npm run typecheck # TypeScript type checking
npm run test      # Run tests with vitest
```

## License

MIT
